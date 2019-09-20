$(document).ready(function(){
//     $.ajax({
//         url: '/api/user/allArticles',
//         type: 'GET',
//         success: function(result) {
//          console.log(result);
         
//              for (let i in result.articles){
//                 $('#showART').append(
               
// // '<div class="card "  style="width: 18rem;">',               
// // '<div class="row">',
// //   '<div class="column">',
  
// //     '<div class="card">',
// //     '<h1>'+result.articles[i].title+'</h1>',
// //     '<p>'+result.articles[i].content+'</p>',
// //     '</div>',
// //   '</div>',
// //   '</div>',


// '<div class="card-deck">',

//       '<div class=" border border-info mt-5">',
//         '<img src="..." class="card-img-top  mt-3" alt="...">',
//         '<div class="card-body">',
//           '<h5 class="card-title text-danger">'+result.articles[i].title+'</h5>',
//           '<p class="card-text text-light">'+result.articles[i].content+'</p>',
          
//         '</div>',
//         '<div class="border border-info">',
//           '<small class="text-muted pt-3">'+"CreateAt: "+result.articles[i].createAt+'</small>',
//           '<small class="text-muted">'+"LastUpdate: "+result.articles[i].lastUpdate+'</small>',
//           '<small class="text-muted ">'+"Author: "+result.articles[i].owner.firstName+"  "+result.articles[i].owner.lastName+'</small>',
//         '</div>',
//       '</div>',
//       '<a class="btn btn-danger delete-article" href="" data-id=result.articles._id>'+'Delete'+'</a>',
//       '<a class="btn btn-success delete-article" href="user/ArticleEdit/<%=result.articles._id%>" >'+'update'+'</a>',
//     '</div>'






//                 // '<td>'+result.articles[i].title+'</td>',
//                 // '<td>'+result.articles[i].content+'</td>'
//                 )
//              }
//         },
//         error: function(err) {
//             console.log(err);
//         }    
       
//     })
//     $('#showMyArticle').click(function(e){
//         e.preventDefault();
//         let data = {
//                     title: $('#title').val(),
//                     content: $('#content').val(),
                    
//                 }
                
// })

     ///////////////delete/////////
     
      $('.todo-list-group').on('click', '#delete-article', function(e) {
      e.preventDefault();
      

      const id = $(this).attr('data-id');
      $.ajax({
        type:'DELETE',
        url: '/api/user/deleteArticle/'+id,
        
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
    $("#sumbitEdit").submit(function(e){
      e.preventDefault();
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