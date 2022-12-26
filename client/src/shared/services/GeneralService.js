// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

class GeneralService {
    static convertPartModelFile = (payload) => {
        let url = `${process.env.REACT_APP_BASE_SERVER_URL2}/api/v1/converter/test5`;

        return new Promise((resolve, reject) => {
            axios
                .post(url, payload)
                .then(response => {
                    console.log(response)
                    if (response.status === 200) {
                        resolve(response.data.url);
                    }
                })
                .catch(err => {
                    NotificationManager.error(err.message, "Error", 3000);
                    reject(err);
                })
        })
    }
}

export default GeneralService;