var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const SSE_RESPONSE_HEADER = {
  'Connection': 'keep-alive',
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'X-Accel-Buffering': 'no'
};

router.get('/sse/:reqId', function(req, res) {

  let reqId = req.params.reqId;

  // Writes response header.
  res.writeHead(200, SSE_RESPONSE_HEADER);

  let intervalId = setInterval(function() {
    console.log(`>>> Interval loop. reqId: "${reqId}"`);
    data = {
      reqId,
      msg: 'See the timestamp',
      time: new Date().getTime(),
    };

    if (!data)
      res.write(`:\n\n`);
    else
      res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 3000);

  res.write(`:\n\n`);

  req.on("close", function() {
    let reqId = req.params.reqId;
    console.log(`>>> Close. reqId: "${reqId}"`);
    clearInterval(intervalId);
  });

  req.on("end", function() {
    let reqId = req.params.reqId;
    console.log(`>>> End. reqId: "${reqId}"`);
  });

});

module.exports = router;
