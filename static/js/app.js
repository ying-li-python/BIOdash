

function buildMetadata(sample) {

  // select url to collect metadata sample 
  var url = `/metadata/${sample}`;

  // use `d3.json` to fetch the metadata for a sample
    d3.json(url).then(function(response) {
      
      // display response
      console.log(response);

      // use d3 to select ul and clear HTML 
      var selectPanel = d3.select("#sample-metadata").html('');

      // use Object.entries to iterate each key, value for the response 
      Object.entries(response).forEach(([key, value]) => {

        // display key, values 
        console.log(`${key}: ${value}`);

        // create new list element 
        var newLi = document.createElement("li");

        // append key-value pair to list
        newLi.appendChild(document.createTextNode(`${key}: ${value}`));

        // show list in console
        console.log(newLi);

        // add new list to ul 
        selectPanel.node().appendChild(newLi);  

        // adjust list style to none
        newLi.style.listStyle = "none";
        newLi.style.marginTop = 10;
        
      });
  
    });
  }

function buildCharts(sample) {

  // select url to collect samples
  var url = `/samples/${sample}`;
 
  // use `d3.json` to fetch sample info
  d3.json(url).then(function(response) {

    // grab sample values, labels, otu_ids 
    var values = response['sample_values'];
    var labels = response['otu_labels'];
    var otu_ids = response['otu_ids'];

    // confirm data
    console.log("values: ", values);
    console.log("labels: ", labels);
    console.log("otu_ids", otu_ids);

    // create trace for pie chart and grab top 10 sample values, labels, otu_ids by slice()
    var pietrace = {
      labels: otu_ids.slice(0,10), 
      values: values.slice(0,10), 
      hovertext: labels.slice(0,10),
      type: 'pie',
    }

    // create layout for pie chart
    var pielayout = {
      t: 0, 
      l: 0
    };

    var piedata = [pietrace];
    
    // assign variable to "pie" HTML element 
    var PIE = document.getElementById("pie");

    // plot pie chart in "pie" HTML element
    Plotly.newPlot(PIE, piedata, pielayout);

    // create trace for bubble chart
    var bubbletrace = {
      x: otu_ids,
      y: values,
      text: labels, 
      mode: 'markers',
      marker: {
        size: values, 
        color: otu_ids,
        colorscale: "Rainbow"
      }
    };

    // create layout for bubble chart
    var bubblelayout = {
      margin: {t : 0}
      };

    var bubbledata = [bubbletrace];

    // assign variable to "bubble" HTML element
    var BUBBLE = document.getElementById("bubble");

    // plot bubble chart in "bubble" HTML element
    Plotly.newPlot(BUBBLE, bubbledata, bubblelayout);
  });
}

function init() {
  // grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// initialize the dashboard
init();
