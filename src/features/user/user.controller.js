import jwt from 'jsonwebtoken';
import UserRepository from './user.repository.js';
import bcrypt from 'bcrypt';

export default class UserController {

    constructor() {
        this.userRepository = new UserRepository();
    }


    async signUp(req, res, next) {
        const {
            name,
            email,
            password,
            number,
            address,
            country,
            state,
            city,
            pincode,
        } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 12)
            const user = { name, email, password: hashedPassword, number, address, country, state, city, pincode };
            const data = await this.userRepository.signUp(user);
            res.status(201).send(data);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async signIn(req, res, next) {
        try {
            // 1. Find user by email.
            const { email, password } = req.body;
            // console.log(email);
            // console.log(password);
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                return res
                    .status(401)
                    .send('Incorrect email');
            }
            // 2. Compare password with hashed password.
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                // 3. Create token.
                const token = jwt.sign(
                    {
                        userID: user._id,
                        email: user.email,
                    },
                    'AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz',
                    {
                        expiresIn: '30d',
                    }
                );
                // 4. Send token.
                return res.status(200).send({ token });
            } else {
                return res
                    .status(401)
                    .json({ error: 'Incorrect Credentials' });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getCurrentUser(req, res, next) {
        try {
            const userId = req.userID;
            const user = await this.userRepository.findUser(userId);
            return res.status(200).send({ user });
        } catch (error) {
            next(error);
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const userId = req.userID;
            const users = await this.userRepository.getAll(userId);

            if (users.error) {
                return res.status(403).json({ error: users.error });
            }

            // console.log(users);
            return res.status(200).send({ users });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const userId = req.userID;
            const id = req.params.id;
            const user = await this.userRepository.delete(id, userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).send(user);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
