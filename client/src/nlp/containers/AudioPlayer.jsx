// Libraries
import React, { Component } from 'react';
import { connect } from "react-redux";
import ReactPlayer from 'react-player'

// Components
import { Header } from '../../components';

// Actions
import { setOverlay, setDialogData, getAllAudios, deleteAudioFile } from "../../store/index";

class AudioPlayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        const trackLang = "en";

        return (
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="NLP" title="Audio Player" />
                <ReactPlayer
                    // url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
                    // url='http://127.0.0.1:5000/static/audios/vestel_demo_sesli.mp4'
                    // controls={true}
                    // playing={false}
                    // light={false}
                    // width="100%"
                    // height="500px"
                    // config={{
                    //     file: {
                    //         tracks: [
                    //             { kind: 'subtitles', src: 'https://gist.githubusercontent.com/samdutton/ca37f3adaf4e23679957b8083e061177/raw/e19399fbccbc069a2af4266e5120ae6bad62699a/sample.vtt', srcLang: 'en', default: true },
                    //             { kind: 'subtitles', src: 'subs/subtitles.ja.vtt', srcLang: 'ja' },
                    //             { kind: 'subtitles', src: 'subs/subtitles.de.vtt', srcLang: 'de' }
                    //         ]
                    //     }
                    // }}
                    config={{
                        file: {
                            attributes: {
                                crossOrigin: "anonymous"
                            },
                            tracks: [
                                {
                                    kind: "subtitles",
                                    src:
                                        "https://raw.githubusercontent.com/benwfreed/test-subtitles/master/mmvo72166981784.vtt",
                                    srcLang: "en",
                                    default: true,
                                    mode: trackLang === "en" ? "showing" : "hidden"
                                },
                                {
                                    kind: "subtitles",
                                    src:
                                        "https://gist.githubusercontent.com/samdutton/ca37f3adaf4e23679957b8083e061177/raw/e19399fbccbc069a2af4266e5120ae6bad62699a/sample.vtt",
                                    srcLang: "it",
                                    default: false,
                                    mode: trackLang === "it" ? "showing" : "hidden"
                                }
                            ]
                        }
                    }}
                    url={`https://iandevlin.github.io/mdn/video-player-with-captions/video/sintel-short.mp4`}
                    playing={true}
                    loop
                    // url='http://127.0.0.1:5000/static/audios/vestel_demo_sesli.mp4'
                    controls={true}
                    light={false}
                    muted={false}
                    width="100%"
                    height="500px"
                />
                {/* </Box> */}
            </div >
        );
    }
};

const mstp = (state) => {
    return {
        audios: state.nlp.audios
    }
}

const mdtp = (dispatch) => {
    return {
        getAllAudios: () => dispatch(getAllAudios()),
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        deleteAudioFile: (payload) => dispatch(deleteAudioFile(payload)),
        setDialogData: (payload) => dispatch(setDialogData(payload))
    }
}

export default connect(mstp, mdtp)(AudioPlayer);
