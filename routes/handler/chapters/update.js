const apiAdapter = require('../../apiAdapter');
const {
    URL_SERVICES_COURSE
} =process.env;

const api = apiAdapter(URL_SERVICES_COURSE);

module.exports = async (req, res) => {
    try {
        const id = req.params.id;
        const chapter = await api.put(`/api/chapters/${id}`, req.body);
        return res.json(chapter.data);
    }catch (error) {

        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({status: 'error', message: 'service unvaible'});
        }

        const { status, data } = error.response;
        return res.status(status).json(data);
    }
}