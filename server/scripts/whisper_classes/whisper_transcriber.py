import os
import sys
import torch
import whisper
from tqdm import tqdm
import torch.utils.data
import whisper.tokenizer
from scripts.whisper_classes.dataset_manager import split_chunks, reset_folder
from scripts.whisper_classes.whisper_model import WhisperModelModule, TurkishSpeechDataset, WhisperDataCollatorWhithPadding

class WhisperTranscriber:

    def __init__(self, config, checkpoint_path):
        self.config = config
        self.model_name = config['model_name']

        state_dict = torch.load(self.__find_last_checkpoint(checkpoint_path))
        state_dict = state_dict['state_dict']

        self.whisper_model = WhisperModelModule(config)
        self.whisper_model.load_state_dict(state_dict)
        self.tokenizer = whisper.tokenizer.get_tokenizer(True, language='tr', task='transcribe')
        self.options = whisper.DecodingOptions(language='tr', without_timestamps=True, fp16=False)
    
    def __find_last_checkpoint(self, path):
        last_files = []

        for file in os.listdir(path):
            if file.endswith('.ckpt'):
                last_files.append(
                    int(file.split('=')[-1].split('.')[0])
                )

        last_file = f'{path}/checkpoint-epoch={max(last_files)}.ckpt'
        return last_file

    def __export_tqdm(self, pbar, path):
        percent = (100 * pbar.n) / pbar.total
        percent = int(round(percent, 0))

        stdout_obj = sys.stdout
        sys.stdout = open(path, 'w')
        print(percent)
        sys.stdout.close()
        sys.stdout = stdout_obj
    
    def transcribe_sound(self, wave_path, wave_file, output_path=None):
        if output_path is None: output_path = wave_path
        reset_folder(output_path)
        chunks = split_chunks(wave_path, wave_file, output_path)

        result_list = []
        with tqdm(total=len(chunks), desc='Transcribing') as pbar:
            for chunk in chunks:
                dataset = TurkishSpeechDataset([chunk], self.tokenizer, self.config['sample_rate'])
                loader = torch.utils.data.DataLoader(dataset, batch_size=self.config['batch_size'], collate_fn=WhisperDataCollatorWhithPadding())
            
                for b in loader:
                    input_ids = b['input_ids']

                    with torch.no_grad():
                        results = self.whisper_model.model.decode(input_ids, self.options)

                        for r in results:
                            result_list.append(r.text)

                pbar.update(1)
                self.__export_tqdm(pbar, f'{output_path}/_progress.txt')
            elapsed_time = pbar.format_dict['elapsed']

        return ' '.join(result_list), float(elapsed_time)