const fs = require('fs');

let rawdata = fs.readFileSync('../conf/initial.json');  
let initial = JSON.parse(rawdata); 

const makeList= (paramExampleDict, text) => {
    paramNameList = getTextEntities(text, Object.keys(paramExampleDict))
    ModExamples = []
    response = []
    text = [text]

    if (paramNameList.length>0){
        paramNameList.forEach((param, numParam) => {
            if (Array.isArray(paramExampleDict[param])) {
                paramExampleDict[param].forEach((value, index) => {
                    text.forEach(example =>{
                        paramStart = example.indexOf(`{`+param+`}`)-numParam*3
                        if (paramStart > -1){
                            paramEnd = paramStart + value.length-1
                            ModExamples.push(index+ `||` + example.replace(`{`+param+`}`,value) + `$${param}-${paramStart}-${paramEnd}`)
                        }
                    })  
                })
            } else {
                Object.keys(paramExampleDict[param]).forEach((value, index) => {
                    text.forEach(example =>{
                        paramStart = example.indexOf(`{`+param+`}`)-numParam*3
                        if (paramStart > -1){
                            paramEnd = paramStart + value.length-1
                            ModExamples.push(index+ `||` + example.replace(`{`+param+`}`,value) + `$${param}-${paramStart}-${paramEnd}`)
                        }
                    })  
                })
            }
            text = ModExamples
        })
        ModExamples.forEach(example =>{
            if (example.split("||").length == paramNameList.length+1){
                temp = []
                output = example.split("||")
                temp = output[output.length-1].split("$")
                //console.log(temp)
                response.push(temp)
            }
        })
    }
    else {
        response = [text]
    }
    return response
}

const getTextEntities = (text, replacementList) => {
    output = []
    replacementList.forEach(replacement =>{
        if (text.indexOf(`{`+replacement+`}`) > -1){
            output.push(replacement)
        }
    })
    return output
}


module.exports.makeList = (entities, text) => {
    return makeList(entities, text)
}
module.exports.getJson = () => {
    return initial
}

module.exports.getTextEntities = (text, replacementList) => {
    return getTextEntities(text, replacementList)
}