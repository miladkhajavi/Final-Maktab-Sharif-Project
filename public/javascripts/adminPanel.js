$(document).ready(function(){
    ///get admin
    $.ajax({
        url: 'admin/adminData',
        type: 'GET',
        success: function(result) {
            console.log(result);
            $('#trbodyadmin').html(
                '<td>'+''+'</td>'+
                '<td>'+result.users[0].firstName+'</td>'+
                '<td>'+result.users[0].lastName+'</td>'+
                '<td>'+result.users[0].email+'</td>'+
                '<td>'+result.users[0].username+'</td>'+
                '<td>'+result.users[0].mobile+'</td>'
                )
        },
        error: function(err) {
            console.log(err);
        }
    })

    // ///get all users
    // $.ajax({
    //     url: 'admin/getAllUsers',
    //     type: 'GET',
    //     success: function(result) {
    //         console.log(result);
            
    //         for (let i in result.users){
    //         $('#tBody').append(
    //             '<tr >',
    //             '<td>'+i+'</td>'+
    //             '<td>'+result.users[i].firstName+'</td>'+
    //             '<td>'+result.users[i].lastName+'</td>'+
    //             '<td>'+result.users[i].email+'</td>'+
    //             '<td>'+result.users[i].username+'</td>'+
    //             '<td>'+result.users[i].mobile+'</td>'+
    //            '<td>'+ '<button id="UserEdit" class="btn btn-success">'+'Edit'+'</button>'+
    //             '<button id="UserDelete" class="btn btn-danger">'+'Delete'+'</button>'+ '</td>'+
    //             '</tr>' 
    //         )
    //     }
    //     },
    //     error: function(err) {
    //         console.log(err);
    //     }
    // })



    ///get all users
    // $.ajax({
    //     url: 'admin/ShowAllArticles',
    //     type: 'GET',
    //     success: function(result) {
    //         console.log(result);
    //         for (let i in result.articles){
    //            $('#images').append("")+
    //            $('#title').append(result.articles[i].title)+
    //            $('#content').append(result.articles[i].content)+
    //            $('.c').append(result.articles[i].createAt)+
    //            $('.l').append(result.articles[i].lastUpdate)
    //         }

    //     },
    //     error: function(err) {
    //         console.log(err);
    //     }
    // })
    // $.ajax({
    //     url: 'getAllUsers',
    //     type: 'GET',
    //     success: function(result) {
    //         console.log(result);
    //     },
    //     error: function(err) {
    //         console.log(err);
    //     }
    // })

    // $('#submit').click(function(e){
    //     e.preventDefault();

    //     let data = {
    //         firstName: $('#firstName').val(),
    //         lastName: $('#lastName').val(),
    //         mobile: $('#mobile').val(),
    //         password: $('#password').val(),
    //     }

    //     console.log(data);


        
    // })



    // delete users by admin
    $('tbody').on('click', '#delete-user', function(e) {
        e.preventDefault();
        
  
        const id = $(this).attr('data-id');
        $.ajax({
          type:'DELETE',
          url: '/api/admin/deleteUsers/'+id,
          
          success: function(response){
            console.log(response);
            alert('Deleting This user?');
            window.location.reload();
          },
          error: function(err){
            console.log(err);
          }
        });
      });

//       $('.articleContainer').hide()
// // click article
// $('#allArticles').click((e)=>{
//   e.preventDefault();

//   $('.articleContainer').show()
//   $('.useradminTable').hide()
  
// })

  //delete article //////////////
  ///////////////delete/////////
  ///////////////delete/////////
     
  $('.todo-list-group').on('click', '#delete-article', function(e) {
    e.preventDefault();
    

    const id = $(this).attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/api/admin/deleteArticle/'+id,
      
      success: function(response){
        console.log(response);
        alert('Deleting Article');
        window.location.reload();
      },
      error: function(err){
        console.log(err);
      }
    });
  });   
  


  // ///////recovery
  $('#recoveryPassword').click((e)=>{
    e.preventDefault();
    const id = $(this).attr('data-id-user');
    $.ajax({
      type:'put',
      url: '/api/admin/recoveryPass/'+id,
      contentType: 'application/json',
      data,
      success: function(response){
        console.log(response);
        alert('Recovery Password');
        window.location.reload();
      },
      error: function(err){
        console.log(err);
      }
    });
  });   

  
    


// modal
$('.modal').hide();
$('#profilePic').click((e)=>{
  e.preventDefault();
  $('.modal').show()
  $('#close').click((e)=>{
    e.preventDefault();
    $('.modal').hide();
  })
  $('.close').click((e)=>{
    e.preventDefault();
    $('.modal').hide();
  })
})


});