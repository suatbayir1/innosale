export const dateToTableFormat = (date) => {
    if (date === null) {
        return null;
    }

    let temp = new Date(date);

    return `${temp.getDate()}/${temp.getMonth() + 1}/${temp.getFullYear()} ${temp.getHours()}:${temp.getMinutes()}:${temp.getSeconds()}`;
}