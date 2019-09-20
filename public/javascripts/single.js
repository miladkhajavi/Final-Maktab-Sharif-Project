$(document).ready(function(){
// $("#submitComment").click(function(e){
//     e.preventDefault();
    
//   });

// $("#textComment").keydown(function (e) { 
    
//     if (document.getElementById("textComment").value == "") {
//         document.getElementById("btnSendComment").disabled = true;
//     } else {
//         document.getElementById("btnSendComment").disabled = false;
//     }
// });   






$('.thiscomment').on('click', '#delete-comment', function(e) {
    e.preventDefault();
    

    const id = $(this).attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/api/commentDelete/'+id,
      
      success: function(response){
        console.log(response);
        alert('Deleting comment');
        window.location.reload();
      },
      error: function(err){
        console.log(err);
      }
    });
  });   

})