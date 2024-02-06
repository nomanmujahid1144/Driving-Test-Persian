const express = require("express");
const dotenv = require("dotenv");
const mongoSanitizer = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");
const connectDb = require("./config/db");
const fileupload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const cors = require("cors");
const mongoose = require("mongoose");
const DeliveryPerson = require("./models/DeliveryPerson");
const Order = require("./models/Order");
const Radius = require("./models/Radius");
const Product = require("./models/Product");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
  allowEIO3: true,
});
const Emitter = require("events");

const errorResponse = require("./utils/errorResponse");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// connect to database
connectDb();

//event emmiter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);
app.set("io", io);

//Data sanitization against NoSQL query injection
app.use(mongoSanitizer());

//Data sanitization against xss(cross site scripting)
app.use(xss()); // this middleware is used to prevent any malicious stuff through html code

// Set security headers
app.use(helmet());

//Request Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 mins
  max: 500, //100 requests per 10 mins
});

//Route files
const user = require("./routes/user");
const admin = require("./routes/admin");
const announcement = require("./routes/announcement");
const faqs = require("./routes/faqs");
const about = require("./routes/about");
const blog = require("./routes/blog");
const delivery = require("./routes/delivery");
const category = require("./routes/category");
const teacher = require("./routes/Teacher");
const questions = require("./routes/questions");
const testQuestions = require("./routes/testQuestions");
const videos = require("./routes/video");
const usefulTips = require("./routes/usefulTps");
const answers = require("./routes/answers");
const testAnswers = require("./routes/testAnswers");
const deviceInfo = require("./routes/deviceInfo");
const product = require("./routes/product");
const driver = require("./routes/deliveryPerson");
const vehicle = require("./routes/vehicleDetails");
const order = require("./routes/order");
const headerImages = require("./routes/headerImages");

//Body Parser
app.use(express.json({ limit: "50mb" }));

// Dev logging middleware
app.use(morgan("dev"));

//File uploading
app.use(fileupload());

app.use(cors());
// Mount routers

app.use("/api/v1/user", user);
app.use("/api/v1/admin", admin);
app.use("/api/v1/announcement", announcement);
app.use("/api/v1/about", about);
app.use("/api/v1/category", category);
app.use("/api/v1/teacher", teacher);
app.use("/api/v1/question", questions);
app.use("/api/v1/testQuestion", testQuestions);
app.use("/api/v1/video", videos);
app.use("/api/v1/tips", usefulTips);
app.use("/api/v1/answer", answers);
app.use("/api/v1/testAnswer", testAnswers);
app.use("/api/v1/device", deviceInfo);
app.use("/api/v1/faq", faqs);
app.use("/api/v1/delivery", delivery);
app.use("/api/v1/product", product);
app.use("/api/v1/driver", driver);
app.use("/api/v1/vehicle", vehicle);
app.use("/api/v1/order", order);
app.use("/api/v1/banner", headerImages);

// set static folder
app.use(express.static(path.join(__dirname, "public")));
// app.use('*', (req, res, next) => {
//     next(new errorResponse('resource not found', 404))
// })

app.use(errorHandler);

const PORT = process.env.PORT;

const server = http.listen(PORT, console.log(`server running on port ${PORT}`));

// Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //close server and exit process
  server.close(() => process.exit(1));
});

const getDelivery = async (checkDriverLocation) => {
  console.log("in function calculating delivery : ", checkDriverLocation);
  const adminRadius = await Radius.find({}, { radius: 1 });
  console.log(adminRadius, " :admin radius")
  let allRadius = []
  if (adminRadius.length > 0) {
    for (let i = 0; i < adminRadius.length; i++) {
      const radiusCheck = await Radius.findOne({
        "geometry.coordinates": {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [
                parseFloat(checkDriverLocation.geometry[0]),
                parseFloat(checkDriverLocation.geometry[1]),
              ],
            },
            $maxDistance: parseFloat(adminRadius[i].radius),
          },
        },
      });
      if (radiusCheck) {
        allRadius.push(radiusCheck)
      }
    }
  }
  else {
    return []
  }

  //get respective shop orders in whose range driver is currently
  let orders = []
  if (allRadius.length > 0) {
    orders = await Order.find({ status: "1", shopAddress: allRadius[0].formattedAddress })
      .populate("userId")
      .populate("details.productId");
    console.log(orders, "These Orders I got")
  }


  // let comparingCoor = await DeliveryPerson.find({
  //   "geometry.coordinates": {
  //     $nearSphere: {
  //       $geometry: {
  //         type: "Point",
  //         coordinates: [
  //           parseFloat(checkDriverLocation.geometry[0]),
  //           parseFloat(checkDriverLocation.geometry[1]),
  //         ],
  //       },
  //       $maxDistance: parseInt(adminRadius[0].radius),
  //     },
  //   },
  // });

  // console.log("these are the orders : ", orders);
  if (orders.length < 1) {
    // console.log(comparingCoor.length, " : drivers in the radius");
    return [];
  } else {
    console.log(allRadius[0].geometry.coordinates, " :shop address")
    return { orders: orders, shopAddress: allRadius[0].geometry.coordinates };
  }
};

io.on("connection", (socket) => {
  console.log("user connected");
  // Join
  socket.on("join", (driverId) => {
    socket.join(driverId);
    io.to(socket.id).emit(
      "hey",
      "******************************8this string is sent by the server at socket connection*****************************************8"
    );
  });


  const driverCoordinates = async (cor) => {
    console.log(cor, "DriverCoordinates")
    // socket.emit('driverCoordinates' , {coordinates : cor})
    io.emit('driverCoordinates', { cor })
  }

  socket.on('geometry', (coordinates) => {
    driverCoordinates(coordinates)
    console.log(coordinates, 'coordinates')
  })

  socket.on("updateCoords", async (data) => {
    console.log(data, 'data')
    // console.log("got in socket : ", JSON.parse(new Object(data)));
    // console.log(data);
    // const updatedCoords = await DeliveryPerson.findByIdAndUpdate(
    //   mongoose.Types.ObjectId(data.driverId),
    //   { "geometry.coordinates": data.geometry },
    //   { new: true }
    // );

    socket.emit("orderUpdated");
    // let ordersAllowed = await getDelivery(JSON.parse(new Object(data)));
    let ordersAllowed = await getDelivery(data);
    io.to(socket.id).emit("deliveryReq", ordersAllowed);
  });
})
