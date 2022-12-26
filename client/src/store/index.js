export {
    login,
} from "../auth/authActions";

export {
    getParts,
    addPart,
    deletePart,
    updatePart,
    setPartsGridLoading,
    setPartOverlayLoading,
} from "../parts/partActions";

export {
    getOperations,
    setOperationsGridLoading,
} from "../operations/operationActions";

export {
    setOverlay,
    setDialogData,
} from "../shared/sharedActions";

export {
    getAllAudios,
    uploadAudioFile,
    deleteAudioFile,
    setUploadAudioLoading,
    updateAudio,
} from "../nlp/nlpActions";