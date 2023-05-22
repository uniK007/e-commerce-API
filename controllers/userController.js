const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    if (!users) {
        res.status(204);
        throw new Error('No Users');
    }
    res.status(200).json(users);
});

const registerUser = asyncHandler(async (req, res) => {
    try {
        const { name, age, email, password, phone, role } = req.body;
        if (!name && !age && !password && !phone && !email) {
            res.status(204);
            throw new Error("Please enter the required user details");
        }
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            res.status(400);
            throw new Error("User is already registered, try different email & phone number");
        }
        // Check if the new password is valid
        if (!password || password.length < 6) {
            return res.status(400).send({ error: 'Password must be at least 6 characters long' });
        }

        const user = new User({
            name,
            age,
            email,
            password,
            phone,
            role
        });

        await user.save();
        //generate token
        const token = await user.generateAuthToken();

        res.status(201).json({ success: true, token, user });
    } catch (error) {
        res.json(error.message);
    }
});

// login user
const loginUser = asyncHandler(async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone && !password) {
            res.status(400);
            throw new Error('Invalid credential or password');
        }
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(401).send({ error: 'Login failed! Wrong credentials' })
        }

        const isValidPassword = await user.isValidPassword(password);
        //compare the sign in password with hashed password which was created at time of sign up
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = await user.generateAuthToken();

        res.status(200).json({ message: `${user.name} logged in successfully`, token });
    } catch (error) {
        res.status(500).json(error.message);
    }
});

// logout user
const logoutUser = asyncHandler(async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.status(200).json('Logged out successfully');
    } catch (error) {
        res.status(500).json(error.message);
    }

});

// logout from all devices
const logoutUserAll = asyncHandler(async (req, res) => {

    try {
        req.user.tokens.splice(0, req.user.tokens.length);
        await req.user.save();
        res.status(200).json({ message: "Logged out from all devices successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
});

//get user list
const getUserById = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            res.status(400);
            throw new Error("User doesn't exists");
        }
        res.status(200).json(user);
    } catch (error) {
        res.json(error.message)
    }
});

const updateUserById = asyncHandler(async (req, res) => {
    try {
        const { password, name, email, phone, age } = req.body;
        // Check if the new password is valid
        if (!password || password.length < 6) {
            return res.status(400).send({ error: 'Password must be at least 6 characters long' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            password,
            name,
            email,
            phone,
            age,
            {
                new: true
            });

        if (!user) {
            res.status(400);
            throw new Error("User doesn't exists");
        }

        res.status(200).json({
            message: "User data is updated successfully",
            success: true,
            user
        });
    } catch (error) {
        res.json(error.message);
    }
});

const deleteUserById = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            res.status(400);
            throw new Error("User doesn't exists");
        }
        res.status(200).json({
            success: true,
            message: `User with id ${req.params.id} is deleted successfully`
        });
    } catch (error) {
        res.json(error.message);
    }

});

//forgot password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // generate password reset token 
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;

        //token expires in 1 hr
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        // Send password reset email with recovery link
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password',
            },
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: user.email,
            subject: 'Password reset',
            text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
              Please click on the following link, or paste this into your browser to complete the process:\n\n
              http://${req.headers.host}/reset-password/${token}\n\n
              If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Error sending email' });
            }
            console.log(info);
            res.status(200).json({ message: 'Password recovery email sent' });
        });
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
});

// Reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }

        // Set new password and reset token fields
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

module.exports = {
    getUsers,
    registerUser,
    deleteUserById,
    getUserById,
    updateUserById,
    loginUser,
    logoutUser,
    logoutUserAll,
    forgotPassword,
    resetPassword
}