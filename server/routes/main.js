const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/**
 * GET /
 * HOME
 */

router.get('', async (req, res) => {


    try {

        const locals = {
            title: "NodeJs Blog",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }]).skip(perPage * page - perPage).limit(perPage).exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals, data, current: page, nextPage: hasNextPage ? nextPage : null, currentRoute: '/'
        })

    } catch (error) {
        console.log(error);
    }
})



// router.get('', async (req, res) => {

//     const locals = {
//         title: "NodeJs Blog",
//         description: "Simple Blog created with NodeJs, Express & MongoDb."
//     }
//     try {
//         const data = await Post.find();
//         res.render('index', { locals, data });
//     } catch (error) {
//         console.log(error);
//     }
// })



/**
 * GET /
 * Post : id
 */

router.get('/post/:id', async (req, res) => {

    try {

        let slug = req.params.id;

        const data = await Post.findById({ _id: slug });

        const locals = {
            title: data.title,
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        res.render('post', { locals, data, currentRoute: `/post/${slug}` });
    } catch (error) {
        console.log(error);
    }
})


/**
 * POST /
 * Post - searchTerm
 */

router.post('/search', async (req, res) => {

    try {
        const locals = {
            title: "Search",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")

        const data = await Post.find({
            $or: [
                {
                    title: {
                        $regex: new RegExp(searchNoSpecialChar, 'i')
                    }
                }, {
                    body: {
                        $regex: new RegExp(searchNoSpecialChar, 'i')
                    }
                }
            ]
        });
        res.render("search", { locals, data });

    } catch (error) {
        console.log(error);
    }
})



router.get('/about', (req, res) => {
    res.render('about', { currentRoute: '/about' })
});

function insertPostData() {
    Post.insertMany([
        {
            title: "NodeJs Limiting Network Traffic",
            body: "Understand how to work with MongoDB and Mongoose, and Object Data Modeling (ODM) library, in Node.js application"
        }, {
            title: "build real-time, event-driven application in Node.js application",
            body: "Socket.io Learn how to use Socket.io to build real-time, event-driven application in Node.js "
        }, {
            title: "Asynchronous Programming with Node.js",
            body: "Asynchronous Programming with Node.js Explore the asynchronous nature of Node.js and how it allows you for ..."
        }, {
            title: "Learn the basics of Node.js and its architecture",
            body: "Learn the basics of Node.js and its architecture, how it works and why it is popular among developers."
        }, {
            title: "NodeJs Limiting Network Traffic",
            body: "Learn how to limit network traffic."
        }, {
            title: "Learn Morgan - HTTP Request logger for NodeJs",
            body: "Learn Morgan."
        }, {
            title: "Introduction to Express.js",
            body: "Learn about Express.js, a minimal and flexible Node.js web application framework, and how to use it to build web applications."
        },
        {
            title: "MongoDB Aggregation Framework",
            body: "Explore MongoDB's Aggregation Framework and learn how to perform advanced queries, data analysis, and data processing."
        },
        {
            title: "Authentication with Passport.js",
            body: "Implement user authentication and authorization in your Node.js applications using Passport.js, a popular authentication middleware."
        },
        {
            title: "Error Handling in Node.js",
            body: "Understand best practices for error handling in Node.js applications to ensure robustness and reliability."
        },
        {
            title: "RESTful API Design with Node.js",
            body: "Learn how to design and implement RESTful APIs in Node.js for building scalable and maintainable web services."
        },
        {
            title: "Testing Node.js Applications",
            body: "Discover different testing strategies and tools for testing Node.js applications to ensure quality and reliability."
        }
    ])
}
// insertPostData();

module.exports = router;