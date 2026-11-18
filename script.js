// Paste the deployed API Gateway invoke URL here after creating the API.
const API_ENDPOINT = "https://mgajnx0r2m.execute-api.ap-south-1.amazonaws.com/default/student-project-backend";
const form = document.querySelector("#contactForm");
const status = document.querySelector("#status");
const button = document.querySelector("#submit");
const nav = document.querySelector("#nav");
document.querySelector("#menu").addEventListener("click",()=>nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const data={
    name:document.querySelector("#name").value.trim(),
    email:document.querySelector("#email").value.trim(),
    message:document.querySelector("#message").value.trim()
  };
  if(data.name.length<2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.message.length<5){
    status.style.color="#ffb3b3"; status.textContent="Enter a valid name, email, and message (minimum 5 characters)."; return;
  }
  if(!API_ENDPOINT){status.style.color="#ffd28a";status.textContent="Demo mode: validation works. Add your API Gateway URL in script.js to connect Lambda.";return;}
  button.disabled=true;button.textContent="Sending...";
  try{
    const res=await fetch(API_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
    const result=await res.json();
    if(!res.ok)throw new Error(result.message||"Request failed");
    status.style.color="#9cebbd";status.textContent=result.message||"Message received successfully.";form.reset();
  }catch(err){status.style.color="#ffb3b3";status.textContent="Could not send. Check API URL, CORS, and Lambda logs.";console.error(err);}
  finally{button.disabled=false;button.textContent="➤ Send Message";}
});