/***
Author : Sajal Kayan
DFP Async Loader

This method uses DFP's normal tagging method which *does not* allow expandable ad units!

Currently the script attempts to load regular javascript ads simulating regular DFP behavour.

IMPORTANT: This script must be called AFTER LABjs is loaded.

INCOMPLETE SCRIPT : WILL BREAK YOUR SITE
*/

//debug

//var renderad = [];
function docwrt(str){
        console.log(str);
  var script = str.replace(/(.*)\=\"/g, '').replace(/\"(.*)/g, '');
        //console.log(script.match(/cookie\.js/g));
  if (script.match(/cookie\.js/g)){
          //console.log("cookiejs")
    $LAB.script(script).wait();
  } else {
    $LAB.script(script).wait(function(){
      
      // following function makes the magic happen!
      
      // lets load the ads
      console.log(adslots);
      if (adslots){
        for (var x in adslots){
          console.log(adslots[x]["pubid"] + " - " + adslots[x]["slotname"]);
          GA_googleAddSlot(adslots[x]["pubid"], adslots[x]["slotname"]);
        }
      }
      GA_googleFetchAds();
      // now comes the fun part.. rendering them
      var Wrapper_GA_googleFillSlot = function(targetad){
        var slotname  = targetad["slotname"];
        var targetloc  = targetad["target"];
        var docwrttemp = function(str){
          var adscript = str.match(/[\"|\'](.*)[\"|\']/g, '');
          adscript = adscript[0].replace(/\"/g, '');
          adscript = adscript.replace(/\'/g, "");
          console.log(targetloc + " - " + str);
          console.log(targetloc + " - " + adscript);
          function renderad(str, targetloc){            
            console.log(targetloc + " - " + str)
            target = document.getElementById(targetloc);
            target.innerHTML = str            
          }
          document.write = function(str){
            renderad(str, targetloc);
          };    
          $LAB.script(adscript).wait();
        };
        document.write = docwrttemp;
        GA_googleFillSlot(slotname);
      };
      for (var x in adslots){
        console.log(adslots[x]["target"]);
        Wrapper_GA_googleFillSlot(adslots[x]);        
      }
      //GA_googleAddSlot("DFPpubid", "test_async_lb");
      //Wrapper_googleFillSlotWithSize("ca-pub-7046344781760701", "test_async_lb", 728, 90, "leaderboard");
      //Wrapper_googleFillSlotWithSize("ca-pub-7046344781760701", "test_async_sky", 160, 600, "skyscraper");
    });
  }
}

document.write = docwrt; //intercepts document.write from below script
$LAB.script("http://partner.googleadservices.com/gampad/google_service.js").wait(function(){
  GS_googleAddAdSenseService(DFPpubid);
  GS_googleEnableAllServices();
});
