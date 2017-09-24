var AYLIENTextAPI = require('aylien_textapi');
var textapi = new AYLIENTextAPI({
  application_id: "e3f22c31",
  application_key: "96e77289aebcee16003e475f2667a8b7"
});
/*
textapi.sentiment({
    'text': 'John is a very good football player!'
}, function(error, response) {
    if (error === null) {
        console.log(response);
    }
});*/
         


 
  var hierarchy = {};
  
  hierarchy['Auto Parts'] = 5;
  hierarchy['Auto Repair'] = 5;
  hierarchy['Construction'] = 7;
  hierarchy['Home Repair'] = 7;
  hierarchy['Environmental Safety'] = 7;
  hierarchy['Daycare/Pre School'] = 8;
  hierarchy['Eldercare'] = 8;
  hierarchy['Food Allergies'] = 8;
  hierarchy['Road-side Assistance'] = 7;
  hierarchy['Remodeling & Construction'] = 8;
  hierarchy['U.S. Government Resources'] = 5;
  hierarchy['Agriculture'] = 4;
  hierarchy['7-12 Education'] = 6;
  hierarchy['Adult Education'] = 5;
  hierarchy['Special Education'] = 5;
  hierarchy['Babies & Toddlers'] = 10;
  hierarchy['Pregnancy'] = 10;
  hierarchy['Credit/Debt & Loans'] = 9;
  hierarchy['Senior Living'] = 8;
  hierarchy['Clothing'] = 10;
  hierarchy['Accessories'] = 7;
  hierarchy['Health & Fitness'] = 10
  hierarchy['Food & Drink'] = 10
  hierarchy['Home & Garden'] = 8
  hierarchy['Family & Parenting'] = 7
  hierarchy['Automotive'] = 7
  hierarchy['Business'] = 7
  hierarchy['Education'] = 5
  hierarchy['Law, Gov\'t & Politics'] = 5
  hierarchy['Careers'] = 3
  hierarchy['Arts & Entertainment'] = 1
  hierarchy['Hobbies & Interests'] = 1
  hierarchy['News'] = 1
  
  var category_weight = 0.65;
  
  function getProperty(dict, prop) {
    if (dict[prop] !== undefined) return dict[prop];
    else return 1;
  }
  
  function findCategory(sampleText){
    textapi.classifyByTaxonomy({
      'text': sampleText,
      'taxonomy': 'iab-qag'
    }, function(error, response) {
      if (error === null) {
        category_value(response, sampleText)
      }
    });
  }
  
  
  
  function category_value(json_input, sampleText){
  	var cat_list = json_input.categories;
  	//console.log(cat_list);
  	var prod = 0;
  	for(var i=0;i<cat_list.length;i++){
  	  //console.log(cat_list[i].label);
  		prod+=getProperty(hierarchy, cat_list[i].label)*cat_list[i].score;
  	}
  	prod/=10.0*cat_list.length;
  	//console.log(prod);
  	findSentiment(sampleText, prod);
  }
  
  function findSentiment(sampleText, category){
    textapi.sentiment({
      text: sampleText,
      mode: 'tweet'
    }, function(error, response) {
      if (error === null) {
        sentiment_value(response, category);
      }
    });
  }
  
  
  function sentiment_value(json_input, category){
    var num = 0;
    if(json_input.polarity == "positive"){
      num = -1;
    }
    else if(json_input.polarity == 'negative'){
      num = 1;
    }
  	var sentiment = 0.5*num*json_input.polarity_confidence + 0.5;
  	//console.log(sentiment);
  	val(sentiment, category)
  }
  
  function val(category_val, sentiment_val){
  	var result = (1-category_weight)*sentiment_val + category_weight*category_val;
  	console.log(result);
  }
  
  d = ["Friday",
"baby items",
"ull",
"ull",
"ull",
"ull",
"unknown",
"unknown",
"Sign up at",
"Desperately need men's pants and men's shoes",
"9/2 - We have had several people wanting to volunteer and foster our dogs. While we don't have a foster program and we have enough volunteers the rescue we work with need both badly. They pull animals from us and without them having fosters we would be euthanizing daily. If you would like to foster or volunteer please call Esmaralda (Essie) at 936-641-0074. This will be for Dora's Dawgs and Kats Rescue! Please help them too!",
"ull",
"a fridge",
"a fridge",
"Help needed for 8/31 and beyond to cover shifts to clean",
"Cleaning supplies",
"",
"The following items are most needed",
"",
"mass quantity food",
"",
"Supply Drive 8/30 - 9/7-Diapers (size",
"",
"Supply Drive 8/30 - 9/7-Diapers (size",
"Distribution of supplies noon - 9PM",
"Non-perishable food items",
"the church is sending out teams into the local communities to help repair homes",
"They need cleaning supplies",
"The Post Office has a HUGE delivery of packages and we need some help picking up packages and sorting underwear. ",
"ull",
"Need volunteers to process donations",
"No longer taking donations",
"",
"League City PD Facebook (8/29 4",
"",
"The following items are most needed",
"",
"Due to an influx of clothing items",
"Adult volunteers needed to assist with distribution of donated items. Sign up",
"The following items are most needed",
"",
"New and unused clothing",
"",
"The following items are most needed",
"",
"non-perishable foods",
"",
"asking for clothing and household items",
"8/30 - need volunteers to help with laundry by 2pm",
"",
"",
"The following items are most needed",
"",
"wheelchairs",
"",
"FRESH produce for Hamburgers \u0026 Hot dogs",
"",
"Non-perishable food",
"",
"Accepting donations until Sunday 9/3",
"",
"f non perishable food",
"18+ yrs old and be able to do phsyical labor. Fill out form here",
"Donated (not loaned) medium \u0026 large wire dog crates (we have heard local places are running low on crates so you can buy from Amazon \u0026 get them shipped to the above address",
"Houston",
"Canned ready-to-eat items with pull tops including vegetables and fruit\nProtein in pouches or pull-top cans",
"send email to mtrevino@feedamerica.org",
"food",
"",
"",
" email James Burnett",
"Mainly monetary donations ",
"",
"on FRIDAY",
"",
"on FRIDAY",
"9am-9pm Sign-up http",
"donation drop-off 9am-7pm\nonly accepting",
"volunteer sign-up http",
"Supply Drive - Saturday",
"",
"Accepting donations Monday (9/4) from 10am-6pm. Tuesday we'll go back to our regular hours",
"http",
"",
"",
"Dog food",
"",
"Need clothing (EXCEPT underwear",
"",
"Need everything",
"",
"food",
"",
"food",
"",
"food",
"",
"Collecting school supplies and HISD school uniforms during business hours\nMonday-Saturday 10am-6pm\nSunday 12pm-6pm",
"",
"Amazon Wish List\nhttps",
"",
"peanut butter",
"",
"we are requesting only  NEW items",
"",
"BLOOD DRIVE 8/31 until 6pm\nTaking place at the Denton A. Cooley Auditorium on the lower level of the Texas Heart Institute",
"",
"Receiving Donations",
"",
"Receiving Donations",
"",
"BLOOD DRIVE Wednesday 9/6 9am-1",
"",
"open until 6pm",
"Volunteers needed 9/3 and 9/4. Volunteer sign-up",
"ull",
"",
"Please limit donations to these specific items. All other supplies will need to be turned away. \n- wheelchairs\n- wheelchair cushions\n- walkers\n- canes\n- catheters\n- diapers (children and adult)\n- gloves\n- bed liners ",
"",
"food",
"We are putting together backpacks for kids to go back to school with and we need supplies and volunteers",
"animal crates",
"",
"bottled water baby items (diapers",
"",
"In the wake of Hurricane Harvey",
"",
"Non perishable foods",
"",
"Cleaning supplies",
"",
"Donations are welcome every day from 10am–4pm.\n\nTaking baby items",
"",
"Undergarments\nSocks\nUniforms\nDeodorant\nHand sanitizer\nPillows\nBlankets\nShoes\nToothbrushes",
"",
"",
"",
"Flooded - no longer accepting donations",
"Contact Victoria",
"DONATION ITENS NEEDED",
"",
"SHIP ONLY - NOT A DROP-OFF POINT\nWe will be immediately focused on relief and assisting shelters",
"Friday August 31st and Saturday Sept. 1st from 10am-4pm",
"They are collecting the following from Friday",
"",
"Anything but clothing; such as baby",
"",
"FRIDAY 10am-3pm\nclothing and bedding items",
"- ON-CALL Volunteers",
"",
"Need donation host and Front desk to field calls \nSign up",
"Drop off 9am-4pm Sept 1\n non-cellulose sponges for flood buckets. \nhttps",
"10am - 4pm",
"Canned food \u0026 Dry food\nToilet paper\nTrash bags\nDog food\nDiapers all size\nBaby formula Similac blue and Enfamil Gatorade/pedialyte\ncleaning supplies\nchildren's and teen socks\nnew underwear all sizes\nboard games\nFinancial assistance\n((no additional bags of clothing at this time))",
"",
"call ahead - need food and supplies for firefighters",
"",
"call ahead - need food and supplies for firefighters",
"",
"call ahead - need food and supplies for firefighters",
"call ahead",
"call to find out specific needs",
"",
"All donations but clothing",
"",
"baby wipes",
"taking donations and volunteers until Friday",
"taking donations and volunteers until Friday",
"",
"FRIDAY 9/1 10am-4pm\n\n    work gloves",
"",
"a drop-off location for donations that will\n be taken to the Montgomery County Fairgrounds where all evacuee animals\n have been taken. The items being requested are cat and dog food",
"Sign up to volunteer HERE",
"Packing tape",
"Will need volunteers on Tuesday 9/5 for cleaning",
"cleaning supplies",
"We collect donations and send out work teams to clean out houses. Monday- Friday 9am - 5pm",
"Food",
"Call ahead.",
"Shutting down as shelter",
"Construction",
"Food",
"M-Sa",
"Water",
"Volunteers needed. Organizing crews of volunteers to clean-up neighborhood homes. 8am - 1pm Thursday 8/31 - Saturday 9/2",
"",
"",
"fresh fruits  and vegetables ",
"",
"any food",
"Organizing volunteers to clean houses",
"Spaghetti",
"",
"canned food",
"visit calvaryhouston.com to volunteer - will have 4 shifts of 20 people each",
"ull",
"Providing people with hot meals. Need 2-3 volunteers that can do 5/8-hour shift.",
"up and running food truck; paper goods - containers",
"",
"toddler pull ups",
"Sept. 2 10am - 6pm",
"Water coolers",
"",
"our school wants to collect needed supplies to send",
"Volunteers needed for the Day Camp",
"Walmart gift cards can be sent to",
"Volunteers needed to help clean out and/or gut people's homes. Volunteer times are 5 - 9/9 10",
"Cleaning"]
for(var i=0;i<d.length;i++){
  findCategory(d[i]);
}
  