const jwt = require('jsonwebtoken');
const apiAdapter = require('../../apiAdapter');
const {
    URL_SERVICES_USER,
    JWT_SECRET,
    JWT_SECRET_REFRESH_TOKEN,
    JWT_ACCESS_TOKEN_EXPIRED,
} =process.env;

const api = apiAdapter(URL_SERVICES_USER);

module.exports = async (req, res) => {
    try {
       const refreshToken = req.body.refresh_token;
       const email = req.body.email;

       if(!refreshToken || !email) {
           return res.status(400).json({
               status: 'error',
               message: 'invalid Token'
           });
       };

       await api.get('/refresh_tokens', { params: { refresh_token: refreshToken }});

       jwt.verify(refreshToken, JWT_SECRET_REFRESH_TOKEN, (err, decode)=> {
           if (err) {
               return res.status(403).json({
                   status: 'error',
                   message: err.message
               });
           }

           if (email !== decode.data.email) {
               return res.status(400).json({
                   status: 'error',
                   message: 'email is not valid'
               });
           }

           const token = jwt.sign({ data: decode.data }, JWT_SECRET, {expiresIn: JWT_ACCESS_TOKEN_EXPIRED});
           return res.json({
               status: 'succes',
               data: token
           });
       });

    }catch (error) {

        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({status: 'error', message: 'service unvaible'});
        }

        const {status, data} = error.response;
        return res.status(status).json(data);
    }
}