const jwt = require('jsonwebtoken');
const User = require('./models/User');

module.exports = (app) => {
    app.post('/register', async (req, res) => {
        const user = new User(req.body);
        try {
            await user.save();
            res.status(201).send({ message: 'User created' });
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    });

    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.validatePassword(password))) {
            return res.status(401).send({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ _id: user._id }, 'motdepasse', { expiresIn: '1h' });
        res.send({ token });
    });

    app.get('/users', async (req, res) => {
        const users = await User.find().select('-password');
        res.send(users);
    });
};
