const express = require('express')
const router = express.Router()
const User = require('../model/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user)
    } catch(error) {
        res.send(400).send(error)
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    console.log(_id)

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send('<h1>Hello</h1>')
        }
        res.status(201).send(user)
    } catch(error) {
        res.status(500).send(error)
    }

})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['name', 'email', 'password', 'age']
    const isValidUpdate = updates.every((update) => allowUpdates.includes(update))
    if (!isValidUpdate) {
        return res.status(400).send({ error: "Invalid updates!" })
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch(error) {
        res.status(400).send(error)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({ user, token })
    } catch(error) {
        res.status(400).send(error)
    }

})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch(error) {
        res.status(404).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        await user.save()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send() 
    } catch (error) {
        res.status(400).send(error)
    }
})

const avatars = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, avatars.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        
        if (!user || !user.avatar) {
            throw new Error ()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch(error) {
        res.status(404).send()
    }
})

module.exports = router 