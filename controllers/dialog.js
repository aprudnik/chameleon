responses = {}
responses['Greeting'] = "Hello I am Chat Bot and my name is Chameleon"
responses['None'] = "Sorry I don't understand, can you rephrase?"


module.exports = (intent,res) => {
    console.log(responses[intent])
    res(responses[intent])
}