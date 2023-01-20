var startButton = document.getElementById("get-started-button");
var bottomCTAButton = document.getElementById("bottom-cta-button");

var qs = new URLSearchParams(window.location.search);

function getLeadChannel() {

  // No referrer means the user accessed the website directly
  if (document.referrer.length === 0) return "direct";

  // If we get to this point, it means that document.referrer is not empty
  if (qs.entries.length === 0) return "organic";

  return "paid";
};

function handleCTAClick() {
  // This set method must be first in order for the getLeadChannel logic to work correctly
  // Because it checks that all qs.entries are of length 0 ('meaning organic traffic')
  // It also checks document.referrer to differentiate direct vs organic
  qs.set('lead_channel', getLeadChannel());
  qs.set('referrer', document.referrer);
  qs.set('landing_page', window.location.href);

  var currentDomain = JSON.parse(document.getElementById("domain").textContent);

  window.location.replace(currentDomain + "/get-a-quote/?" + qs.toString());
};

startButton.addEventListener("click", handleCTAClick);
bottomCTAButton.addEventListener("click", handleCTAClick);
