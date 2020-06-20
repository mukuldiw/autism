// Custom js for modifying bootstrap file input
$('#inpFile').change(function (e) {
    if (e.target.files.length) {
        $(this).next('.custom-file-label').html(e.target.files[0].name);
    }
});

let form = document.getElementById('form')
let inpFile = document.getElementById('inpFile')
form.addEventListener('submit',e=>{
    // Prevent default form submit action
    e.preventDefault()

    url="https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/d8f3c7de-5983-43eb-848d-2d2d2496c871/classify/iterations/Iteration_final/image"
    file = inpFile.files[0]

    // Return if no file is uploaded
    if(inpFile.files.length == 0)
        return true

    //Clearing Form
    e.target.reset()
    $('#inpFile').next('.custom-file-label').html('Choose another file');

    // POST request using fetch API
    fetch(url,{
        method:'POST',
        headers:{
            'Content-Type':'application/octet-stream',
            'Prediction-Key': 'd2e92f120b7141b9ad170c9e3fe87245',
        },
        body:file
    })
    .then((response)=>{
            return response.json()
        })
    .then(success)
    .catch((error) => {
            console.error('Error: ', error);
        });

})

//Success function definition
success = (data)=>{
    console.log(data);
        let a_prob, na_prob

    // data1 probability
        let data1 = data.predictions[0]
        let tag1 = data1.tagName
    // data2 Probability
        let data2 = data.predictions[1]
        let tag2 = data2.tagName
    // Matching tags with 'Autistic' and 'Not Autistic'
    if(tag1=='Autistic')
    {
        a_prob=data1.probability
        na_prob=data2.probability
    }
    else
    {
        a_prob=data2.probability
        na_prob=data1.probability
    }
    //Deciding Output
        let ouput
        console.log(a_prob,na_prob);
        output = (a_prob > na_prob) ? "Child is Autistic": "Child is Not Autistic";
        console.log(output);
        if(a_prob==na_prob)
        {
            output="Results are inconclusive"
        }
    // Creating string
        let str=`
                    <hr>
                    <div class="row">
                        <div class="col-md-4 mt-2">
                            <img id="output" width="200" class="rounded" />
                        </div>
                        <div class="col-md-6 mt-2">
                            <p class="lead">
                                <b>Results</b>
                                <br>${output}
                            </p>
                        </div>
                    </div>

                    <table class="table my-3">
                    <thead class="thead-light">
                        <tr>
                        <th scope="col">Tag</th>
                        <th scope="col">Probability</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td scope="row">Autistic</td>
                        <td>${a_prob}%</td>
                        </tr>
                        <tr>
                        <td scope="row">Not Autistic</td>
                        <td>${na_prob}%</td>
                        </tr>
                    </tbody>
                    </table>
                `
        // Rendering to DOM
        let result = document.getElementById('result');
        result.innerHTML=str
        let image = document.getElementById('output');
        image.src = URL.createObjectURL(file);

};
