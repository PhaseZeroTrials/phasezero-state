import axios from 'axios';

async function getWidgets() {
    return await axios.get(`/FormComponents/widgets`);
}

export default {
    getWidgets,
};
