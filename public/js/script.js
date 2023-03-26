function validate()
{
    let name=document.querySelector(".name");
    let email=document.querySelector(".email");
    let message=document.querySelector(".message");
    let sendbtn=document.querySelector(".send-btn");

    sendbtn.addEventListener("click",(e)=>
    {
        e.preventDefault();
        if (name.value == "" || email.value == "" || message.value == "")
        {
            emptyerror();
        }
        else
        {
            sendmail (name.value,email.value,message.value);
            success();
            document.querySelector(".contact-form").reset();
        }
    });
}
validate();

function sendmail(name,email,message)
{
    emailjs.send("service_x7jrshc","template_5kttzqp",{
        from_name: name,
        email_id: email,
        message: message,
        });
}

function emptyerror()
{
    swal({
        title: "oh no....",
        text: "Fields cannot be empty",
        icon: "error",
      });
}

function success()
{
    swal({
        title: "Email sent successfully",
        text: "We try to reply in 24 hours",
        icon: "success",
    });
}