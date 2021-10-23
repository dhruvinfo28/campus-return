var email = document.getElementById("email");
var passcode = document.getElementById("passcode");
var s = document.getElementById("popup");
var storedemail = localStorage.getItem("clientemail");
var storedpassword = localStorage.getItem("clientpassword");
if (storedemail != null && storedpassword != null) {
    email.value = storedemail;
    passcode.value = storedpassword;
}
function Signupform() {
    document.getElementById("login").style.display = "none";
    document.getElementById("signup").style.display = "block";
}
function Loginform() {
    document.getElementById("signup").style.display = "none";
    document.getElementById("login").style.display = "block";
}
function savedetails() {
    if (email.value == "" || passcode.value == "") {
        s.className = "show";
        s.innerHTML = "ALL FIELDS ARE MANDATORY";
        setTimeout(function () { s.className = s.className.replace("show", ""); }, 3000);
        return 1;
    } else {
        s.className = "show";
        s.innerHTML = "Remember? <a onclick='save()'>YES</a> <a onclick='donone()'>NO</a> <a onclick='erase()'>ERASE</a>";
        setTimeout(function () { s.className = s.className.replace("show", ""); }, 3000);
    }
}
function save() {
    if (storedemail == email.value && storedpassword == passcode.value) {
        s.className = "show";
        s.innerHTML = "DETAILS ALREADY SAVED";
        setTimeout(function () { s.className = s.className.replace("show", ""); }, 3000);
        return 1;
    } else {
        localStorage.setItem("clientemail", email.value);
        localStorage.setItem("clientpassword", passcode.value);
        s.className = "show";
        s.innerHTML = "DETAILS REMEMBERED";
        setTimeout(function () { s.className = s.className.replace("show", ""); }, 3000);
        storedemail = localStorage.getItem("clientemail");
        storedpassword = localStorage.getItem("clientpassword");
    }
}
function donone() {
    setTimeout(function () { s.className = s.className.replace("show", ""); }, 000);
}
function erase() {
    localStorage.setItem("clientemail", "");
    localStorage.setItem("clientpassword", "");
    s.className = "show";
    s.innerHTML = "THROWN TO TRASH";
    setTimeout(function () { s.className = s.className.replace("show", ""); }, 3000);
}
function ValidateSubmission() {
    var n = document.getElementById("username");
    var t = document.getElementById("mob");
    var e = document.getElementById("emailaddress");
    var str = e.value.toLowerCase();
    var p1 = document.getElementById("password");
    var p2 = document.getElementById("Cpassword");
    var f = document.getElementById("signup");
    var regularExpression = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (n.value == "" || t.value == "") {
        s.className = "show";
        s.innerHTML = "ALL FIELDS ARE MANDATORY";
        setTimeout(function () { s.className = s.className.replace("show", ""); }, 3000);
        return 1;
    }
    else if (!str.match(/gmail/g) && !str.match(/hotmail/g) && !str.match(/yahoo/g) && !str.match(/outlook/g)) {
        alert(str);
        s.className = "show";
        s.innerHTML = "EMAIL NOT ALLOWED";
        setTimeout(function () { s.className = s.className.replace("show", ""); }, 3000);
        return 1;
    }
    else if (!regularExpression.test(p1.value)) {
        s.className = "show";
        s.innerHTML = ">5 CHARACTERS";
        setTimeout(function () { s.className = s.className.replace("show", ""); }, 3000);
        return 1;
    }
    else if (p1.value != p2.value || p1.value == "") {
        s.className = "show";
        s.innerHTML = "PASSWORD MISSMATCH";
        setTimeout(function () { s.className = s.className.replace("show", ""); }, 3000);
        return 1;
    }
    else {
        f.submit();
    }
} 