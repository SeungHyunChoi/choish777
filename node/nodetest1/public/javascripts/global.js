// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {
    // Populate the user table on initial page load
    //populateTable();

     // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#userList table tbody').on('click','td a.linkdeleteuser', deleteUser);

});

// Functions =============================================================

// Fill table with data
function populateTable() {
     // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;
 
// { "_id" : ObjectId("552624cc3d8de130b42f4d82"), "username" : "testuser1", "email
// " : "testuser1@testdomain.com" }
// { "_id" : ObjectId("552624d63d8de130b42f4d83"), "username" : "testuser2", "email
// " : "testuser2@testdomain.com" }
// { "_id" : ObjectId("552624d63d8de130b42f4d84"), "username" : "testuser3", "email
// " : "testuser3@testdomain.com" }
// { "_id" : ObjectId("552625953d8de130b42f4d85"), "username" : "csh", "email" : "c
// hoish777@mail.com" }
// { "_id" : ObjectId("5526267ff327c8cc2ebbc412"), "username" : "g", "email" : "g"
// }
// { "_id" : ObjectId("5526268ef327c8cc2ebbc413"), "username" : "gg", "email" : "gg
// " }
// { "_id" : ObjectId("55262ae4f327c8cc2ebbc414"), "username" : "wag", "email" : "a
// weg" }
// { "_id" : ObjectId("55264696ee3a67282e39ff57"), "username" : "g", "email" : "g"
// }
 


         // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="gg" title="Show Details"></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="55264696ee3a67282e39ff57">delete</a></td>';
            tableContent += '</tr>';
        });
         // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

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
            'useremail': $('#addUser fieldset input#inputUserEmail').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/adduser',
            dataType: 'JSON'
        }).success(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
               // populateTable();
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
            document.location.reload();

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
                     $('#resultDIV').append(response);
                    }
                    , beforeSend: function() {
                     //통신을 시작할때 처리
                     alert('시작합니다.');
                    }
                    , complete: function() {
                     //통신이 완료된 후 처리
                     alert('끝났습니다.');
                    document.location.reload();

                    }
                });


    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};