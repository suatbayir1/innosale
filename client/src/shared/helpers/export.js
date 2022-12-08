export const downloadFile = (params) => {
    const link = document.createElement('a');
    link.href = `${process.env.REACT_APP_BASE_SERVER_URL}/static/audios/${params.filename}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}