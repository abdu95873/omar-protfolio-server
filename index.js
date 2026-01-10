const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


//middlewares ..........
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mh16alw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Customers Query.................................................

    const customersQueryCollection = client.db("omarWebsite").collection("customersQuery");

    app.post('/customerInfo', async (req, res) => {
      const customerInfo = req.body;
      const result = await customersQueryCollection.insertOne(customerInfo);
      res.send(result);
    });

    app.get('/customerInfo/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await customersQueryCollection.findOne(query);
      res.send(result);

    })

    // app.put('/customerInfo/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const updatedStates = req.body;
    //   const filter = { _id: new ObjectId(id) };
    //   const options = { upsert: true }
    //   const updateDoc = {
    //     $set: {
    //       states: updatedStates.states
    //     },
    //   };
    //   const result = await customersQueryCollection.updateOne(filter, updateDoc, options);
    //   res.send(result);
    // })


    app.patch('/customerInfo/:id', async (req, res) => {
      const id = req.params.id;
      const updatedStates = req.body;
      const filter = { _id: new ObjectId(id) };

      // Update only the fields that are present in the request body
      const updateDoc = {
        $set: {}
      };

      if (updatedStates.name !== undefined) {
        updateDoc.$set.name = updatedStates.name;
      }
      if (updatedStates.number !== undefined) {
        updateDoc.$set.number = updatedStates.number;
      }
      if (updatedStates.subject !== undefined) {
        updateDoc.$set.subject = updatedStates.subject;
      }
      if (updatedStates.message !== undefined) {
        updateDoc.$set.message = updatedStates.message;
      }
      if (updatedStates.states !== undefined) {
        updateDoc.$set.states = updatedStates.states;
      }

      const result = await customersQueryCollection.updateOne(filter, updateDoc);
      res.send(result);
    });


    app.get('/customerInfo', async (req, res) => {
      const result = await customersQueryCollection.find().toArray();
      res.send(result);
    })


    // Banner Section................................................

    const bannerImageUpdate = client.db("omarWebsite").collection("bannerImage");

    app.post('/bannerImage', async (req, res) => {
      const bannerImage = req.body;

      const result = await bannerImageUpdate.insertOne(bannerImage);
      res.send(result);
    });

    app.get('/bannerImage', async (req, res) => {
      const result = await bannerImageUpdate.find().toArray();
      res.send(result);
    })

    app.get('/bannerImage/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await bannerImageUpdate.findOne(query);
      res.send(result);

    })

    app.put('/bannerImage/:id', async (req, res) => {
      const id = req.params.id;
      const updatedUrl = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          image: updatedUrl.image
        },
      };
      const result = await bannerImageUpdate.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    // about section.................................................
    const about = client.db("omarWebsite").collection("about");

    app.get('/about', async (req, res) => {
      const result = await about.find().toArray();
      res.send(result);
    })

    app.get('/about/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await about.findOne(query);
      res.send(result);

    })

    app.put('/about/:id', async (req, res) => {
      const id = req.params.id;
      const aboutInfo = req.body;
      console.log(id, aboutInfo)
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          subtitle: aboutInfo.subtitle,
          url: aboutInfo.url,
          details: aboutInfo.details
        }
      }
      const result = await about.updateOne(filter, updateDoc, options);
      res.send(result);

    });

    // Add a new About entry
    app.post('/about', async (req, res) => {
      const aboutData = req.body;

      // Validate the request body
      if (!aboutData.subtitle || !aboutData.url || !aboutData.details) {
        return res.status(400).send({ message: 'subtitle, url, and details are required' });
      }

      try {
        const result = await about.insertOne(aboutData);
        res.send({
          message: 'About entry added successfully',
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error('Error adding about entry:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });


    // DELETE /about/:id
    app.delete('/about/:id', async (req, res) => {
      const id = req.params.id;

      try {
        const query = { _id: new ObjectId(id) };
        const result = await about.deleteOne(query);

        if (result.deletedCount === 1) {
          res.status(200).json({ message: 'Video deleted successfully' });
        } else {
          res.status(404).json({ message: 'Video not found' });
        }
      } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });



    // portfolio section.................................................
    const portfolioImageUpdate = client.db("omarWebsite").collection("portfolioImage");

    app.get('/portfolioImage', async (req, res) => {
      const result = await portfolioImageUpdate.find().toArray();
      res.send(result);
    })

    app.get('/portfolioImage/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await portfolioImageUpdate.findOne(query);
      res.send(result);

    })

    app.put('/portfolioImage/:id', async (req, res) => {
      const id = req.params.id;
      const updateUrl = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          image: updateUrl.image
        },
      }
      const result = await portfolioImageUpdate.updateOne(filter, updateDoc, options);
      res.send(result);

    });

    //  app.post('/portfolioImage', async (req, res) => {
    //    const portfolioImage = req.body;

    //    const result = await portfolioImageUpdate.insertOne(portfolioImage);
    //    res.send(result);
    //  });



    // storySection..................................................


    const storySectionUpdate = client.db("omarWebsite").collection("storySection");

    app.get('/storySection', async (req, res) => {
      const result = await storySectionUpdate.find().toArray();
      res.send(result);
    })

    app.get('/storySection/:id', async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });
      const story = await storySectionUpdate.findOne({ _id: new ObjectId(id) });
      if (!story) return res.status(404).json({ message: 'Story not found' });
      res.send(story);
    });

    app.patch('/storySection/:id', async (req, res) => {
      const id = req.params.id;
      const updateInfos = req.body;
      const filter = { _id: new ObjectId(id) };

      // Update only the fields that are present in the request body
      const updateDoc = {
        $set: {}
      };

      if (updateInfos.image !== undefined) {
        updateDoc.$set.image = updateInfos.image;
      }
      if (updateInfos.textOne !== undefined) {
        updateDoc.$set.textOne = updateInfos.textOne;
      }
      if (updateInfos.textTwo !== undefined) {
        updateDoc.$set.textTwo = updateInfos.textTwo;
      }
      if (updateInfos.name !== undefined) {
        updateDoc.$set.name = updateInfos.name;
      }
      if (updateInfos.designation !== undefined) {
        updateDoc.$set.designation = updateInfos.designation;
      }

      const result = await storySectionUpdate.updateOne(filter, updateDoc);
      res.send(result);
    });


    app.post('/storySection', async (req, res) => {
      const portfolioImage = req.body;

      const result = await storySectionUpdate.insertOne(portfolioImage);
      res.send(result);
    });


    // DELETE a story by id
    app.delete('/storySection/:id', async (req, res) => {
      const id = req.params.id;

      // Validate ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      try {
        const query = { _id: new ObjectId(id) };
        const result = await storySectionUpdate.deleteOne(query);

        if (result.deletedCount === 1) {
          res.status(200).json({ message: "Story deleted successfully" });
        } else {
          res.status(404).json({ message: "Story not found" });
        }
      } catch (error) {
        console.error("Error deleting story:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });









    //  Review Section....................................

    const reviewAdd = client.db("omarWebsite").collection("reviewSection");

    app.post('/reviewSection', async (req, res) => {
      const review = req.body;

      const result = await reviewAdd.insertOne(review);
      res.send(result);
    });

    app.get('/reviewSection', async (req, res) => {
      const result = await reviewAdd.find().toArray();
      res.send(result);
    })


    // blog Section..................................................


    const blogSectionUpdate = client.db("omarWebsite").collection("blogSection");

    app.get('/blogSection', async (req, res) => {
      const result = await blogSectionUpdate.find().toArray();
      res.send(result);
    })

    app.get('/blogSection/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await blogSectionUpdate.findOne(query);
      res.send(result);

    })

    app.patch('/blogSection/:id', async (req, res) => {
      const id = req.params.id;
      const updateInfos = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {}
      };

      if (updateInfos.image !== undefined) {
        updateDoc.$set.image = updateInfos.image;
      }
      if (updateInfos.title !== undefined) {
        updateDoc.$set.title = updateInfos.title;
      }
      if (updateInfos.details !== undefined) {
        updateDoc.$set.details = updateInfos.details;
      }


      const result = await blogSectionUpdate.updateOne(filter, updateDoc);
      res.send(result);
    });


    app.post('/blogSection', async (req, res) => {
      const blogAdd = req.body;

      const result = await blogSectionUpdate.insertOne(blogAdd);
      res.send(result);
    });


    // Gallery section .....................................
    const gallerySectionUpdate = client.db("omarWebsite").collection("gallerySection");

    app.get('/gallerySection', async (req, res) => {
      const result = await gallerySectionUpdate.find().toArray();
      res.send(result);
    });

    app.get('/gallerySection/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await gallerySectionUpdate.findOne(query);
      res.send(result);
    });

    app.patch('/gallerySection/:id', async (req, res) => {
      const id = req.params.id;
      const updateInfos = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: {} };

      if (updateInfos.image !== undefined) {
        updateDoc.$set.image = updateInfos.image;
      }
      if (updateInfos.title !== undefined) {
        updateDoc.$set.title = updateInfos.title;
      }
      if (updateInfos.details !== undefined) {
        updateDoc.$set.details = updateInfos.details;
      }

      const result = await gallerySectionUpdate.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.post('/gallerySection', async (req, res) => {
      const { images, category } = req.body;
      const documents = images.map(imageUrl => ({ imageUrl, category }));

      try {
        const result = await gallerySectionUpdate.insertMany(documents);
        res.send(result);
      } catch (error) {
        console.error('Error inserting images:', error);
        res.status(500).send({ message: 'Error inserting images' });
      }
    });

    app.delete('/gallerySection/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      try {
        const result = await gallerySectionUpdate.deleteOne(query);
        if (result.deletedCount === 1) {
          res.send({ message: 'Image deleted successfully' });
        } else {
          res.status(404).send({ message: 'Image not found' });
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('boss is sitting')
})

app.listen(port, () => {
  console.log(`Omar is sitting on port ${port}`);
})


