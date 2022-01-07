const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");

//DATABASE setup
const Sequelize = require("sequelize");
const { STRING, DATEONLY, INTEGER, BOOLEAN } = Sequelize;
let conn = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/trips"
);

//Server connection
let PORT = process.env.PORT || 8080;

app.use("/dist", express.static(path.join(__dirname, "dist")));
app.use("/media", express.static(path.join(__dirname, "media")));
app.use(express.json());

//Auto seven day creator for testing front page upcoming trips preview
const dateCreator = (days, d = new Date()) => {
  d.setTime(d.getTime() + 86400000 * days);
  return d.toISOString().slice(0, 10);
};

//EXPRESS routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

//Find all clients
app.get("/api/clients", async (req, res, next) => {
  try {
    res.send(await Client.findAll());
  } catch (error) {
    next(error);
  }
});

//Find all destinations
app.get("/api/destinations", async (req, res, next) => {
  try {
    res.send(await Destination.findAll());
  } catch (error) {
    next(error);
  }
});

//Find all trips
app.get("/api/trips", async (req, res, next) => {
  try {
    res.send(
      await Trip.findAll({
        include: [
          {
            model: Client,
          },
          { model: Destination },
        ],
      })
    );
  } catch (error) {
    next(error);
  }
});

app.delete("/api/trips/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const canceledTrip = await Trip.findByPk(req.params.id);
    canceledTrip.destroy();
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
  }
});

//Find next seven trips
app.get("/api/nextseven", async (req, res, next) => {
  try {
    const Op = Sequelize.Op;
    var d = new Date();
    d.setTime(d.getTime() + 86400000 * 7);
    res.send(
      await Trip.findAll({
        include: [
          {
            model: Client,
          },
          { model: Destination },
        ],
        where: {
          date: {
            [Op.between]: [new Date(), d],
          },
        },
      })
    );
  } catch (error) {
    next(error);
  }
});

//Create a trip
app.post("/api/trips", async (req, res, next) => {
  try {
    const { clientName, destinationName, date, purpose } = req.body;
    const newThing = await Trip.create({
      clientId: clientName,
      destinationId: destinationName,
      date: date,
      purpose: purpose,
    });
    const clientTest = (await Client.findByPk(newThing.clientId)).name;
    const newObject = {
      id: newThing.id,
      client: { name: (await Client.findByPk(newThing.clientId)).name },
      destination: {
        name: (await Destination.findByPk(newThing.destinationId)).name,
      },
      purpose: newThing.purpose,
      date: newThing.date,
    };
    res.send(newObject);
  } catch (error) {
    next(error);
  }
});

//Delay a trip by one day
app.put("/api/trips/delay/:id", async (req, res, next) => {
  try {
    const tripToDelay = await Trip.findByPk(req.params.id * 1);
    const parseDate = new Date(tripToDelay.date);
    const addDay = dateCreator(1, parseDate);
    await tripToDelay.update({ date: addDay });
    res.send(tripToDelay);
  } catch (error) {
    next(error);
  }
});

//Delay a trip by seven days
app.put("/api/trips/delay7/:id", async (req, res, next) => {
  try {
    const tripToDelay = await Trip.findByPk(req.params.id * 1);
    const parseDate = new Date(tripToDelay.date);
    const addDay = dateCreator(7, parseDate);
    await tripToDelay.update({ date: addDay });
    res.send(tripToDelay);
  } catch (error) {
    next(error);
  }
});

//DATABASE models
const Client = conn.define("client", {
  name: STRING,
  selected: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

const Destination = conn.define("destination", {
  name: STRING,
  selected: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

const Trip = conn.define("trips", {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DATEONLY,
    defaultValue: Date.now(),
  },
  purpose: {
    type: STRING,
    validate: {
      isIn: [["business", "pleasure", "other"]],
    },
    defaultValue: "other",
  },
});

//A client can have many trips
Client.hasMany(Trip);
//A destination can have many trips (visited many times)
Destination.hasMany(Trip);
//A booked trip belongs to one destination
Trip.belongsTo(Destination, {});
//A booked trip belongs to one client
Trip.belongsTo(Client, {});

//Initial client and trip seeding
const syncAndSeed = async () => {
  await conn.sync({ force: true });
  const kennethR = await Client.create({ name: "Kenneth R" });
  const devinB = await Client.create({ name: "Devin B" });
  const camV = await Client.create({ name: "Cam V" });
  const hein = await Client.create({ name: "Heinnssin P" });
  const john = await Client.create({ name: "John P" });
  const paris = await Destination.create({ name: "Paris, France" });
  const bali = await Destination.create({ name: "Bali, Indonesia" });
  const rome = await Destination.create({ name: "Rome, Italy" });
  const marrakesh = await Destination.create({ name: "Marrakesh, Morocco" });
  //Dummy trip data tied to purpose of dateCreator() 7 should show, 7 should not.
  const mapper = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  mapper.map(async (e) => {
    await Trip.create({
      date: dateCreator(e),
      clientId: kennethR.id,
      destinationId: rome.id,
    });
  });
  mapper.map(async (e) => {
    await Trip.create({
      date: dateCreator(e),
      clientId: devinB.id,
      destinationId: bali.id,
    });
  });
  mapper.map(async (e) => {
    await Trip.create({
      date: dateCreator(e),
      clientId: camV.id,
      destinationId: marrakesh.id,
    });
  });
  mapper.map(async (e) => {
    await Trip.create({
      date: dateCreator(e),
      clientId: hein.id,
      destinationId: paris.id,
    });
  });
  mapper.map(async (e) => {
    await Trip.create({
      date: dateCreator(e),
      clientId: john.id,
      destinationId: paris.id,
    });
  });
};

const init = async () => {
  try {
    //seed the db
    await syncAndSeed();
    //Port configurations

    app.listen(PORT, () => console.log(`ACTIVE on ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

init();
