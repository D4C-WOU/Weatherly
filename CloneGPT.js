let inputfield=document.querySelector(".ask")
let responsecontainer=document.querySelector(".response-container")
let questionasked=document.querySelector('.question-asked p')
let responsetext=document.querySelector('.response-text p')


let apiKey="AIzaSyDMLNq4PXKIRMB07H-vg8ugGCcIjW5_uH4"

async function clone(question) {

  questionasked.textContent=question
  responsetext.textContent= "Thinking..."
  responsecontainer.classList.remove('display-none')


  let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents:[{parts:[{text: question}]}],
    })
  });

  let data = await response.json()


  responsetext.textContent= data.candidates[0].content.parts[0].text
}

inputfield.addEventListener('keydown',function(e){
  if(e.key === "Enter" && inputfield.value.trim() !== ''){
    clone(inputfield.value.trim())
    inputfield.value=""
  }

})