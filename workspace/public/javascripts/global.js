// Userlist data array for filling in info box
var userListData = [];
 
// DOM Ready =============================================================
$(document).ready(function() {
    // Populate the user table on initial page load
   // populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#userList table tbody').on('click','td a.linkdeleteuser', deleteUser);
    
    
    // $('#pagingBst').html(paging.textContent);
    // $('#pagingBst').html(paging.innerHTML);    
    // $('#pagingBst').text(paging.innerHTML);    
    
    shwo();
    
 });

    function shwo(){
        $('#pagingBst').html($('#test').text());    
     }

// Functions =============================================================
  
 function populateTable() {
// Empty content string
var tableContent = '';

// jQuery AJAX call for JSON

$.getJSON( '/userlist', function( data ) {

// Stick our user data array into a userlist variable in the global object
userListData = data;
$("#userList tbody tr").remove();

var tbody = $("#userList tbody:last");

// For each item in our JSON, add a table row and cells to the content string

$.each(data, function(){
tbody.append($('<tr>')

.append($('<td>')

.append($('')

.attr('href', '#')

.data('user', this)

.text(this.username)

.click(showUserInfo)

)

)

.append($('<td>')

.append($('')

.text(this.email)

)

)

.append($('<td>')

.append($('')

.attr('href', '#')

.data('user', this)

.text('delete')

.click(deleteUser)

)

)

);

}); 





// Add User button click

$('#btnAddUser').off().on('click', addUser); 



});

};


// Add User
function addUser(event) {
    event.preventDefault();
     // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'useremail': $('#addUser fieldset input#inputUserEmail').val(),
            'UserFullname': $('#addUser fieldset input#inputUserFullname').val(),
            'UserAge': $('#addUser fieldset input#inputUserAge').val(),
            'UserLocation': $('#addUser fieldset input#inputUserLocation').val(),
            'Gender': $('#addUser fieldset input#inputUserGender').val()

        }

        $.ajax({
            type : "post" //"POST", "GET"
            , data : newUser
            , url : '/adduser/'
            , contentType: "application/x-www-form-urlencoded; charset=UTF-8"
            , error : function(request, status, error) {
             //통신 에러 발생시 처리
             alert(error.message + '에러 발생' );
             }
            , success : function(response, status, request) {
             //통신 성공시 처리
             alert('Success insert');
            }
            , beforeSend: function() {
             //통신을 시작할때 처리
             //alert('시작합니다.');
            }
            , complete: function() {
             //통신이 완료된 후 처리
            document.location.reload();
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();
     // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
       /* $.ajax({
            type: 'post',
            url: '/deleteuser/' + $(this).attr('rel')
        }).success(function( response ) {
             // Check for a successful (blank) response
            if (response.msg === '') {
                alert('Error: ' + response.msg);
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
//            populateTable();
               document.location.reload();
        });
*/

                $.ajax({
                    type : "post" //"POST", "GET"
                    , async : true //true, false
                    , url : '/deleteuser/' + $(this).attr('rel')
                    , contentType: "application/x-www-form-urlencoded; charset=UTF-8"
                    , error : function(request, status, error) {
                     //통신 에러 발생시 처리
                     alert("잠시후 다시 시도해 주세요.");
                    }
                    , success : function(response, status, request) {
                     //통신 성공시 처리
                      alert('Success delete');
                    }
                    , beforeSend: function() {
                     //통신을 시작할때 처리
                     //alert('시작합니다.');
                    }
                    , complete: function() {
                     //통신이 완료된 후 처리
                    document.location.reload();

                    }
                });


    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }
    
    

};


// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

        $.ajax({
            type : "post" //"POST", "GET"
            , async : true //true, false
            , url : '/userlist/' + $(this).attr('rel')
            , dataType: "json"
            , contentType: "application/x-www-form-urlencoded; charset=UTF-8"
            , error : function(request, status, error) {
             //통신 에러 발생시 처리
             alert(error.message + '에러 발생' );
             }
            , success : function(response, status, request) {
             //통신 성공시 처리
                $.each(response, function(index, element) {
                    $('#userInfoName').text(element.fullname);
                    $('#userInfoAge').text(element.userAge);
                    $('#userInfoGender').text(element.gender);
                    $('#userInfoLocation').text(element.userLocation);
                    $('#userInfoDate').text(element.regdt);
                 });

            }
            , beforeSend: function() {
             //통신을 시작할때 처리
             //alert('시작합니다.');
            }
            , complete: function() {
             //통신이 완료된 후 처리
//            document.location.reload();
            }
        });
};