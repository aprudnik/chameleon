responses = {}
responses['Greeting'] = "Hello I am Chat Bot and my name is Chameleon"


module.exports = (intent,res) => {
    console.log(responses[intent])
    res(responses[intent])
}