document.getElementById('viewCount').addEventListener('load', function () {
//use the following url once the website is active again. these urls won't work until its active.
//https://api.countapi.xyz/create?namespace=signature.onrender.com&key=visiters
//<namespace> = signature.onrender.com; <key> = visiters;
    fetch ('https://api.countapi.xyz/create?namespace=signature.onrender.com/visitations')
    .then (response => {
        if (!response.ok) {
            throw new Error ("Network unresponsive.")
        }
        return response.json ();
    })
    .then (data => {
        console.log ("Current view count:", data.value)
        document.getElementById('displayCount').textContent = `${data.value}`
    }).catch (error => {console.error ("Data not found:", error)})
})
document.getElementById('viewCount').addEventListener('load', function () {
//same url but uses hit instead of get
    fetch ('https://api.countapi.xyz/hit/signature.onrender.com/visitations', {
        method: 'POST'
    })
    .then (response => response.json())
    .then(data => {
        console.log("Increasing count:", data.value)
        document.getElementById('displayCount').textContent = `${data.value}`
    }).catch(error => {console.error("Error increasing count:", error)})
})