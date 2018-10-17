responses = {}
responses['Greeting'] = "Hello I am Chat Bot and my name is Chameleon"


module.exports = (intent,res) => {
    res(responses[intent])
}