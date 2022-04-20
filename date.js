module.exports = getDate;

function getDate() {
  var today = new Date();
  var currentDay = today.getDay();
  var currentTime = today.getTime();

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  // var day = today.toLocaleDateString("hi-IN", options);    // For Hindi Language
  var day = today.toLocaleDateString("en-US", options); // For English Language

  return day;
}
