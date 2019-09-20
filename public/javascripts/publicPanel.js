$(document).ready(function () {
  //     $.ajax({
  //         url: '/users/',
  //         type: 'GET',
  //         success: function(result) {
  //          console.log(result);

  //              for (let i in result.articles){
  //                 $('#showART').append(



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
  // $('#singlePublic').click((e)=>{
  $('.singlePage').hide()
  // })
  $('.todo-list-group').on('click', '#singlePublic', function (e) {
    e.preventDefault();
    $('.todo-list-group').hide()
    $('.singlePage').show()
    $('#returnPUblics').click((e) => {
      e.preventDefault();
      $('.singlePage').hide();
      $('.todo-list-group').show()
    })
    const id = $(this).attr('data-id');
    $.ajax({
      url: '/publicArticle/' + id,
      type: 'GET',
      success: function (result) {
        console.log(result);
        $('#imgArt').html(
          result.articles.image)
        $('#titleArt').html(
          result.articles.title)
        $('#contentArt').html(
          result.articles.content)
        $('#creatArt').html(
          'create at: '+result.articles.createAt)
        $('#updatArt').html(
          'last update: '+ result.articles.lastUpdate)

        $('#ownerArt').html('<b class="text-warning">' + 'author: ' + '</b>' + result.user.firstName + ' ' + result.user.lastName)



      }
    })
  })
})