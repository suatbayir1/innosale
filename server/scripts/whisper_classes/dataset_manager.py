import torch
import torchaudio
import torchaudio.transforms as at

import os
import wave
import shutil
import numpy as np
import pandas as pd
from tqdm import tqdm
from pydub import AudioSegment
from pydub.silence import split_on_silence
from sklearn.model_selection import train_test_split

class DatasetManager:

    def __init__(self, dataset_code):
        self.__dataset_code = dataset_code

    def __train_test_scaler(self, train_size, test_size):
        sum = train_size + test_size
        train_size *= 100 / sum / 100
        test_size *= 100 / sum / 100

        return train_size, test_size

    def __get_csv_dataset(self):
        audio_content = pd.read_csv(f'datasets/{self.__dataset_code}/audio_content.csv')
        audio_content['path'] = [f'datasets/{self.__dataset_code}/sounds/' + name for name in audio_content['name'].to_list()]

        return audio_content[['name', 'path', 'content']]
    
    def __get_tuple_dataset(self):
        audio_content = self.__get_csv_dataset()
        df = audio_content.sample(frac=1).reset_index(drop=True)

        return [tuple(df.iloc[i].tolist()) for i in range(len(df))]

    def get_train_test_data(self, train_size:float, test_size:float, random_seed=None):
        data = self.__get_tuple_dataset()
        total_data_size = train_size + test_size
        
        if total_data_size < 0 or 1 < total_data_size:
            return data

        elif total_data_size == 1:
            return train_test_split(data, test_size=test_size, random_state=random_seed)

        elif total_data_size < 1:
            use_rate = float(1) - total_data_size
            use_data, drop_data = train_test_split(data, test_size=use_rate, random_state=random_seed)

            train_size_, test_size_ = self.__train_test_scaler(train_size, test_size)
            return train_test_split(use_data, test_size=test_size_, random_state=random_seed)

def reset_folder(path):
    try:
        shutil.rmtree(path)
        os.makedirs(path)
    except:
        os.makedirs(path)

def load_wave(wave_path, sample_rate:int=16000) -> torch.Tensor:
    waveform, sr = torchaudio.load(wave_path, normalize=True)
    if sample_rate != sr:
        waveform = at.Resample(sr, sample_rate)(waveform)
    return waveform

def split_chunks(wave_path, wave_file, output_path):
    # Splitting chunks
    sound = AudioSegment.from_wav(rf'{wave_path}/{wave_file}')
    chunks = split_on_silence(
        sound,
        keep_silence = 500,
        min_silence_len = 500,
        silence_thresh = sound.dBFS-14
    )
    
    # Saving splitted chunks
    reset_folder(output_path)
    chunk_list = []
    for i, audio_chunk in enumerate(chunks, start=1):
        chunk_filename = os.path.join(output_path, f'chunk{i}.wav')
        audio_chunk.export(chunk_filename, format='wav')
        chunk_list.append((f'chunk{i}.wav', chunk_filename, '.'))
    
    return chunk_list