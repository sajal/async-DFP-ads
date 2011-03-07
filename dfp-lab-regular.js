/***
Author : Sajal Kayan
DFP Async Loader

This method uses DFP's normal tagging method which *does not* allow expandable ad units!

Currently the script attempts to load regular javascript ads simulating regular DFP behavour.

IMPORTANT: This script must be called AFTER LABjs is loaded.

INCOMPLETE SCRIPT : WILL BREAK YOUR SITE
*/

//debug

(function(){
  var targets = [];
  function runScripts(e) {
  	if (e.nodeType != 1) return; //if it's not an element node, return
    
    if (e.tagName.toLowerCase() == 'script') {
      console.log("Evaling" + " - " + e.text);
      eval(e.text); //run the script      
    }
    else {
      var n = e.firstChild;
      while ( n ) {
        if ( n.nodeType == 1 ) runScripts( n ); //if it's an element node, recurse
        n = n.nextSibling;
      }
  	}
  }
  function docwrt(str){
//          console.log(str);
    var script = str.replace(/(.*)\=\"/g, '').replace(/\"(.*)/g, '');
          //console.log(script.match(/cookie\.js/g));
    if (script.match(/cookie\.js/g)){
            //console.log("cookiejs")
      $LAB.script(script).wait();
    } else {
      $LAB.script(script).wait(function(){
        
        // following function makes the magic happen!
        
        // lets load the ads
        //console.log(adslots);
        if (adslots){
          for (var x in adslots){
            //console.log(adslots[x]["pubid"] + " - " + adslots[x]["slotname"]);
            GA_googleAddSlot(adslots[x]["pubid"], adslots[x]["slotname"]);
          }
        }
        GA_googleFetchAds();
        // now comes the fun part.. rendering them
        var Wrapper_GA_googleFillSlot = function(targetad){
          var slotname  = targetad["slotname"];
          var targetloc  = targetad["target"];
          targets.push = {"slotname": slotname, "targetloc": targetloc};
          var docwrttemp = function(str){
            var adscript = str.match(/[\"|\'](.*)[\"|\']/g, '');
            adscript = adscript[0].replace(/\"/g, '');
            adscript = adscript.replace(/\'/g, "");
            //console.log(targetloc + " - " + str);
            //console.log(targetloc + " - " + adscript);
            //adscript = "http://dl.dropbox.com/u/361747/evil-ad.js"; //testing
            target = document.getElementById(targetloc);
            target.innerHTML = ""; //make it blank
            function renderad(str){
              console.log(targetloc + " - " + str)
              //Logic to parse str and $LAB-ify external script goes here
              if (!(str.match(/<script/i))){
                // :D OK no script tags in there inject HTML
                
                target.innerHTML += str;
              } else if (!(str.match(/script.*src/i))) {
              // :( has script but not external
              //parse the inner portion and eval it.
              //$('leaderboard').set('html', str);
                target.innerHTML += str;
                runScripts(target);
              } else {
                  // :'( has external script
                //target.innerHTML += str;
                //runScripts(target);                
                console.log("im broken :(");
              }
            }
            document.write = renderad;    
            
            $LAB.script(adscript).wait(function(){
              if (adslots.length > 0){
                Wrapper_GA_googleFillSlot(adslots.pop());
              }
            });
              
          };
          document.write = docwrttemp;
          GA_googleFillSlot(slotname);
        };
        adslots.reverse(); //cause we read from bottom using pop()
        if (adslots.length > 0){
          Wrapper_GA_googleFillSlot(adslots.pop());
        }
        /*
        for (var x in adslots){
          console.log(adslots[x]["target"]);
          Wrapper_GA_googleFillSlot(adslots[x]);        
        }
        */
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
})();

