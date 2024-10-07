import Model from './model.js';

window.onload = function() {
  const modelInstance = new Model(); // create instance of model.js

  document.getElementById('newest').onclick = () => renderPosts("newest", document.getElementById('big_header').textContent); //sort post by newest
  document.getElementById('oldest').onclick = () => renderPosts("oldest", document.getElementById('big_header').textContent); // sort post by oldest
  document.getElementById('active').onclick = () => renderPosts("active", document.getElementById('big_header').textContent); // sort post by newest comment
  document.getElementById('home_sidebar').onclick= () => renderPosts(); //                                                       home
  document.getElementById('home_sidebar_createc').onclick=() => createComm_post(); //                                            creates comm or post
  document.getElementById('create_post').onclick=() => createComm_post(0);   

  let buttongroup = document.getElementById('main_button_wrapper'); //                                                           global button group
  const searchInput = document.getElementById('search_main');       //                                                           global search
  

  function createComm_post(type = 1){  // will make buttons that control post order and posts invisible 
    let header = document.getElementById('big_header'); 
    let description = document.getElementById('community_description'); // where form will be
    let counter_p = document.getElementById('counter_p');
    let posts = document.getElementById('postsList');
    buttongroup.style.display = 'none';

    if(type === 1){ // functionality to add
    header.innerHTML = "Create Community: ";
    description.innerHTML = `
    <form id="communityForm" style="display: flex; justify-content: center; flex-direction: column; width: 100%;">

    <!-- Community Name -->
    <label for="communityName" style="font-family: Verdana;">Community Name: <span style="color: red;">*</span></label>
    <input type="text" id="communityName" name="communityName" style="width: 500px;" >
    <div id="nameError" style="color: red; font-size: 0.8rem;">Community name cannot be empty and must be less than 100 characters.</div>

    <!-- Community Description -->
    <label for="communityDescription" style="font-family: Verdana;">Community Description: <span style="color: red;">*</span></label>
    <textarea id="communityDescription" name="communityDescription" style="width: 500px;"></textarea>
    <div id="descriptionError" style="color: red; font-size: 0.8rem;">Community description cannot be empty and must be less than 500 characters.</div>

    <!-- Community Username -->
    <label for="communityUsername" style="font-family: Verdana;">Community Username: <span style="color: red;">*</span></label>
    <input type="text" id="communityUsername" name="communityUsername" style="width: 500px;">
    <div id="usernameError" style="color: red; font-size: 0.8rem;">Username cannot be empty.</div>

    <!-- Submit Button -->
    <input type="submit" style="border-radius: 10px; font-size: 0.8rem; cursor: pointer; font-family: Verdana; border: 0; margin: 10px; padding: 10px 20px; width: 12rem;" value="Engender Community">
    </form>

    `; 

    
    document.getElementById('communityForm').addEventListener('submit', function(event) {
      event.preventDefault(); 
      
      const communityName = document.getElementById('communityName').value;
      const communityDescription = document.getElementById('communityDescription').value;
      const communityUsername = document.getElementById('communityUsername').value;
      
      let isValid = true;
      
      // Validate Community Name
      if (communityName.length === 0 || communityName.length > 100) {
        showToast('Community name cannot be empty and must be less than 100 characters.');
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('nameError').style.display = 'none';
      }
      
      // Validate Community Description
      if (communityDescription.length === 0 || communityDescription.length > 500) {
        showToast('Community description cannot be empty and must be less than 500 characters.');
        document.getElementById('descriptionError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('descriptionError').style.display = 'none';
      }
      
      // Validate Community Username
      if (communityUsername.length === 0) {
        showToast('Username cannot be empty.');
        document.getElementById('usernameError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('usernameError').style.display = 'none';
      }
      
      if (isValid) {
        let newCommunity = {
          communityID: `community${modelInstance.data.communities.length + 1}`, //community ID
          name: communityName,
          description: communityDescription,
          postIDs: [], //  post IDs 
          startDate: new Date(), // current data and time
          members: [communityUsername], // creator
          memberCount: 1
        };
      
        // ADDS COMM TO ARRAY
        modelInstance.data.communities.push(newCommunity);
      
        //clear form 
        document.getElementById('communityForm').reset();
      
        console.log('New Community Added:', newCommunity);
        renderCommunities();  
        renderPosts('newest', newCommunity.name);
        
        showToast('Community created successfully!');
      }
    });
    
  }
  else{ // functioanlity to add post
    header.innerHTML = "Create Post: ";
    description.innerHTML = `    
    <form id="postForm" style="display: flex; justify-content: center; flex-direction: column; width: 100%;">

    <!-- Comm Dropdown -->
    <label for="communityDropdown" style="font-family: Verdana;">Select Community: <span style="color: red;">*</span></label>
    <select id="communityDropdown" name="communityDropdown" style="width: 500px;"></select>
    <div id="communityError" style="color: red; font-size: 0.8rem;">Please select a community.</div>

    <!-- Post Title -->
    <label for="postTitle" style="font-family: Verdana;">Post Title: <span style="color: red;">*</span></label>
    <input type="text" id="postTitle" name="postTitle" style="width: 500px;" maxlength="100" required>
    <div id="nameError" style="color: red; font-size: 0.8rem;">Post Title cannot be empty and must be less than 100 characters.</div>
 
    <!-- Link Flair and dropdown -->
    <label for="linkFlair" style="font-family: Verdana;">Select LinkFlair: <span style="color: red;">*</span></label>
    <select id="linkFlair" name="linkFlair" style="width: 500px;"></select>
    <input type="text" id="linkFlairWritein" name="linkFlairWritein" style="width: 500px;" maxlength="30">
    <div id="communityError" style="color: red; font-size: 0.8rem;">Select or Write In 1 Link Flair (optional)</div>

    <!-- post content -->
    <label for="postContent" style="font-family: Verdana;">Post Description: <span style="color: red;">*</span></label>
    <textarea id="postContent" name="postContent" style="width: 500px;" required></textarea>
    <div id="descriptionError" style="color: red; font-size: 0.8rem;">Post Contents cannot be empty.</div>

    <!--  postUsername -->
    <label for="postUsername" style="font-family: Verdana;">Username: <span style="color: red;">*</span></label>
    <input type="text" id="postUsername" name="postUsername" style="width: 500px;" required>
    <div id="usernameError" style="color: red; font-size: 0.8rem;">Username cannot be empty.</div>

    <!-- Submit Button -->
    <input type="submit" style="border-radius: 10px; font-size: 0.8rem; cursor: pointer; font-family: Verdana; border: 0; margin: 10px; padding: 10px 20px; width: 12rem;" value="Submit Post">
    </form>

    `;  // create forms or whatever
        // put data in array

    const communityDropdown = document.getElementById('communityDropdown');     // sorry this is extremely confusing i messed up but if i change it wont work
    const linkFlair = document.getElementById('linkFlair'); 
    const linkFlairWriteIn = document.getElementById('linkFlairWritein'); 

    // you can turn these two methods into one
     function populateDropdownWithCommunities(array, elements) { 
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.textContent = '-- Select Communities --';
      emptyOption.selected = true;
      elements.appendChild(emptyOption);

      array.forEach(community => {
          const option = document.createElement('option'); 
          option.value = community.communityID; 
          option.textContent = community.name;  
          elements.appendChild(option);  // Append the option to the dropdown
      });
    }

    function createLinkFlairInPost(array, dropdown) {
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.textContent = '-- Select a link flair --';
      emptyOption.selected = true;
      dropdown.appendChild(emptyOption);
    
      array.forEach(link => {
        const option = document.createElement('option');
        option.value = link.linkFlairID;
        option.textContent = link.content;
        dropdown.appendChild(option);
      });
    }

    createLinkFlairInPost(modelInstance.data.linkFlairs, linkFlair);
    populateDropdownWithCommunities(modelInstance.data.communities, communityDropdown); //populating drop downs

    //begin processing data

    document.getElementById('postForm').addEventListener('submit', function(event) {
      event.preventDefault(); 

      const commID = document.getElementById('communityDropdown').value;
      const LinkFlairDrop = document.getElementById('linkFlair').value;
      const LinkFlairWrite = document.getElementById('linkFlairWritein').value;
      let lf_container;

      if(commID == ''){   // NEED COMM ID!!
        showToast('Please choose a community');
        return; 
      }

      if(LinkFlairWrite != '' && LinkFlairDrop != ''){
        showToast('You cannot have two Link Flairs');
        return;
      }
      if(LinkFlairWrite == ''){
        lf_container = LinkFlairDrop
      }else{
        lf_container = LinkFlairWrite
      }

      let lf = {
        linkFlairID: `lf${modelInstance.data.linkFlairs.length + 1}`, //lf ID
        content: lf_container
      }

      let newPost = {
        postID: `p${modelInstance.data.posts.length + 1}`, //community ID
        title: document.getElementById('postTitle').value, //name 
        content: document.getElementById('postContent').value, //content 
        linkFlairID: lf.linkFlairID,                          //lf
        postedBy: document.getElementById('postUsername').value,  // username
        postedDate: new Date(), // current data and time
        commentIDs: [],//comments
        views: 0  //veiws
      };
      
      modelInstance.data.linkFlairs.push(lf);                        // add to lf 
      modelInstance.data.posts.push(newPost);                        // add post to post array
      const community = modelInstance.data.communities.find(comm => comm.communityID === commID);
      community.postIDs.push(newPost.postID);


      console.log('New Community Added:', modelInstance.communities);
      console.log('New Post Added:', modelInstance.posts);
      console.log('New LinkFlair Added:', modelInstance.linkFlair);


      document.getElementById('postForm').reset();
      renderCommunities();  
      renderPosts();
      });

  }

    counter_p.innerHTML = "";
    posts.innerHTML = "";
    
  }

  searchInput.addEventListener('keydown', function(event) {
    const postsList = document.getElementById('postsList');
    const header = document.getElementById('big_header');
    const description = document.getElementById('community_description');
    const postnumber = document.getElementById('counter_p');
    //postsList.innerHTML = '';
    //header.innerHTML = '';
    description.innerHTML = '';
    //postnumber.innerHTML = '';
    
    if (event.key === 'Enter') {
      const query = searchInput.value.trim(); 
      //if (query) {
        performSearch(query);
      //}
    }
  });

  function performSearch(query) {
    const terms = query.toLowerCase().split(/\s+/); // split query into terms
    const results = [];

    // Search through posts
    modelInstance.data.posts.forEach(post => {
      const postContent = post.title.toLowerCase() + ' ' + post.content.toLowerCase();
      let matchFound = terms.some(term => postContent.includes(term));

      // Search through comments for each post
      if (!matchFound) {
        modelInstance.data.posts.forEach(post => {
          matchFound = searchForCommentsInPost(post.postID,query);  // call for search comments
        });
      }

      // If the post or any of its comments matched, include it in results
      if (matchFound) {
        results.push(post);
      }
    });

    displaySearchResults(query, results);
  }

  function displaySearchResults(query, results) {
    const postsList = document.getElementById('postsList');
    const header = document.getElementById('big_header');
    const postnumber = document.getElementById('counter_p');

    postsList.innerHTML = ''; 
    header.innerHTML = `Results for: "${query}"`;
    if (results.length > 0) {
      header.innerHTML = `Results for: "${query}"`;
      postnumber.innerHTML = `${results.length} Posts`;

      results.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        
        postElement.innerHTML = `
          <div class="post-header">
              ${post.postedBy} | ${formatTimeAgo(post.postedDate)}
          </div>
          <div class="post-title">${post.title}</div>
          ${post.linkFlairID ? `<div class="link-flair">${getLinkFlairContent(post.linkFlairID)}</div>` : ''}
          <div class="post-content">${post.content.substring(0, 20)}...</div>
          <div class="post-meta">
              <span class="label">Views:</span> ${post.views} 
              <span class="label">Comments:</span> ${countComments(post.postID)}
          </div>
        `;
        postsList.appendChild(postElement);
        postElement.onclick = () => renderPosting(post.postID); 
      });
    } else {
      //header.innerHTML = `No results found for: "${query}"`;
      postnumber.innerHTML = `0 Posts`;

      postsList.innerHTML = `No results found for: ${query}`;
    }
    if(query === ''){
      postnumber.innerHTML = `0 Posts`;

      postsList.innerHTML = `No results found for: "" `;
    }
  }

  function renderPosts(sortOrder = "newest", communityName = "All") {
    const postsList = document.getElementById('postsList');
    const header = document.getElementById('big_header');
    const description = document.getElementById('community_description');
    const postnumber = document.getElementById('counter_p');
    buttongroup.style.display = 'block';
    
    postsList.innerHTML = ''; // clear

    let community = null;
    if (communityName !== "All") {
        community = modelInstance.data.communities.find(c => c.name === communityName);
        if (community) {
            header.innerHTML = community.name; // set comm name
            description.innerHTML = `${community.description} <br> Created: ${formatTimeAgo(community.startDate)}`;
            postnumber.innerHTML = `${community.postIDs.length} Post${community.postIDs.length !== 1 ? 's' : ''}`;
        }
    } else {
        header.innerHTML = "All Posts"; // defualt header
        description.innerHTML = ""; // Clear description
        postnumber.innerHTML = `${modelInstance.data.posts.length} Posts`;
    }

    // sortOrder logic
    const sortedPosts = modelInstance.data.posts.sort((a, b) => {
        if (sortOrder === "newest") {
            return new Date(b.postedDate) - new Date(a.postedDate);
        } else if (sortOrder === "oldest") {
            return new Date(a.postedDate) - new Date(b.postedDate);
        } else if (sortOrder === "active") {
            const latestCommentA = getMostRecentCommentDate(a.commentIDs);
            const latestCommentB = getMostRecentCommentDate(b.commentIDs);

            const latestDateA = latestCommentA ? new Date(latestCommentA) : new Date(a.postedDate);
            const latestDateB = latestCommentB ? new Date(latestCommentB) : new Date(b.postedDate);

            return latestDateB - latestDateA;
        }
    });

    // filter by comm
    const filteredPosts = community ? sortedPosts.filter(post => community.postIDs.includes(post.postID)) : sortedPosts;

    // generate post elemt
    filteredPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        postElement.innerHTML = `
            <div class="post-header">
                ${post.postedBy} | ${formatTimeAgo(post.postedDate)}
            </div>
            <div class="post-title">${post.title}</div>
            ${post.linkFlairID ? `<div class="link-flair">${getLinkFlairContent(post.linkFlairID)}</div>` : ''}
            <div class="post-content">${post.content.substring(0, 20)}...</div>
            <div class="post-meta">
                <span class="label">Views:</span> ${post.views} 
                <span class="label">Comments:</span> ${countComments(post.postID)}
            </div>
        `;

        postElement.classList.add('link');
        postElement.onclick = () => renderPosting(post.postID); // holder

        postsList.appendChild(postElement);
    });
}

function renderCommunities() {
  const comm_list = document.getElementById('comm_list');
  comm_list.innerHTML = ''; // Clear 

  modelInstance.data.communities.forEach(community => {
      const listItem = document.createElement('button');
      listItem.textContent = community.name; 

      listItem.addEventListener('click', function() {
          // Update header, description, and post count when a community is selected
          let header = document.getElementById('big_header'); 
          let description = document.getElementById('community_description'); 
          let counter_p = document.getElementById('counter_p');
          
          header.innerHTML = community.name;
          description.innerHTML = `${community.description} <br> Created: ${formatTimeAgo(community.startDate)}`;
          
          if (community.postIDs.length === 1) {
              counter_p.innerHTML = `${community.postIDs.length} Post`;   
          } else {
              counter_p.innerHTML = `${community.postIDs.length} Posts`;
          }

          // Render posts for the selected community
          renderPosts('newest', community.name);
      });

      comm_list.appendChild(listItem); // Add the button to the list
  });
}

function renderPosting(ReqPostID){
  let header = document.getElementById('big_header');     // clear all this shit
  let description = document.getElementById('community_description');   
  let counter_p = document.getElementById('counter_p');             // generate line here
  let posts = document.getElementById('postsList');                   // generate comments here
  buttongroup.style.display = 'none';
  let comm = modelInstance.data.communities.find(c => c.postIDs.includes(ReqPostID)); //get comm
  let post = getPost(ReqPostID);
  let linkflair = modelInstance.data.linkFlairs.find(l => l.linkFlairID.includes(post.linkFlairID));
  

  
  header.innerHTML = ``;      // init header
  counter_p.innerHTML = '';
  posts.innerHTML = '';
  description.innerHTML = `
        <strong style="font-family: "Verdana"">${comm.name}</strong> | ${formatTimeAgo(post.postedDate)}<br>
        <p style="font-family: "Verdana">Posted by: ${post.postedBy}</p>
        <h2 style="font-family: "Verdana">${post.title}</h2>
        <p style="font-size: 0.75rem; color: white; background-color: var(--reddit-orange); padding: 0.25rem 0.5rem; border-radius: 4px; margin: 1.5px;">${linkflair.content}</p>
        <p style="font-family: "Verdana">${post.content}</p>
        <div style="display: flex; justify-content: space-between;font-family: "Verdana;">
            <span>Views: ${post.views}</span>
            <span>Comments: ${countComments(ReqPostID)}</span>
        </div>
        <button id="comment_button"style="border-radius: 10px; font-size: .8rem; cursor: pointer; font-family: "Verdana"; border: 0; margin: 10px;">Add a comment</button>
        <hr style="border: 1px solid black;">
    `;

//create comment button functionality (done)
document.getElementById('comment_button').addEventListener('click', (event) => {
  event.preventDefault(); 
      writeComments(post.postID); 
      console.log('Added comment');
  });


posts.innerHTML = `
    <div style="font-family: "Verdana">
        <h3 style="font-family: "Verdana">Comments:</h3>
        <div id="comments" style="font-family: "Verdana">
            ${renderCommentsForPost(post.postID)}
        </div>
    </div>
`;

document.querySelectorAll('.reply-button').forEach(button => { // neeeds to have data of comment id
  button.addEventListener('click', () => {
      const commentID = button.getAttribute('data-comment-id'); 
      writeComments(post.postID, commentID); 
      //console.log('Reply button clicked for comment ID:', commentID);
  });
});



    post.views += 1; // increment views

}

function writeComments(ReqPostID, commentID='N/A') {
  let header = document.getElementById('big_header'); 
  let description = document.getElementById('community_description'); // where form will be
  let counter_p = document.getElementById('counter_p');
  let posts = document.getElementById('postsList');
  buttongroup.style.display = 'none';
  counter_p.innerHTML = '';
  posts.innerHTML = '';

  header.innerHTML = "Submit a Reply: "; // You might want to change this to indicate a reply
  description.innerHTML = `
      <form id="commentForm" style="display: flex; justify-content: center; flex-direction: column; width: 100%;">
          <!-- Comment Content -->
          <label for="commentContent" style="font-family: Verdana;">Comment: <span style="color: red;">*</span></label>
          <textarea id="commentContent" name="commentContent" style="width: 500px;" maxlength="500"></textarea>
          <div id="contentError" style="color: red; font-size: 0.8rem;">Comment cannot be empty and must be less than 500 characters.</div>

          <!-- Username -->
          <label for="commentUsername" style="font-family: Verdana;">Username: <span style="color: red;">*</span></label>
          <input type="text" id="commentUsername" name="commentUsername" style="width: 500px;">
          <div id="usernameError" style="color: red; font-size: 0.8rem;">Username cannot be empty.</div>

          <!-- Submit Button -->
          <input type="submit" style="border-radius: 10px; font-size: 0.8rem; cursor: pointer; font-family: Verdana; border: 0; margin: 10px; padding: 10px 20px; width: 12rem;" value="Submit Reply">
      </form>
  `;

  // Hide error 
  document.getElementById('contentError').style.display = 'none';
  document.getElementById('usernameError').style.display = 'none';

  // Handle form submission
  document.getElementById('commentForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the default form submission

      const commentContent = document.getElementById('commentContent').value;
      const commentUsername = document.getElementById('commentUsername').value;
      let isValid = true;

      // Validate comment content
      if (commentContent.length === 0 || commentContent.length > 500) {
          document.getElementById('contentError').style.display = 'block';
          isValid = false;
      } else {
          document.getElementById('contentError').style.display = 'none';
      }

      // Validate username
      if (commentUsername.length === 0) {
          document.getElementById('usernameError').style.display = 'block';
          isValid = false;
      } else {
          document.getElementById('usernameError').style.display = 'none';
      }

    
      if (isValid) {
          // create comment
          let newComment = {
            commentID: `comment${modelInstance.data.comments.length + 1}`, 
            content: commentContent,
            commentedBy: commentUsername,
            commentIDs: [], 
            commentedDate: new Date(), 
          };

          if(!(commentID === 'N/A')){ // add comment to reply if it is a reply to another comment!!!!!!!!
            const commentingon = getComment(commentID);
            commentingon.commentIDs.push(newComment.commentID);
          }
          else{// add comment direcctly to post if it is not a reply to another comment
          let targetPost = getPost(ReqPostID);
            if (targetPost) {
                targetPost.commentIDs.unshift(newComment.commentID); 
            }
          }
          modelInstance.data.comments.push(newComment); 

          //back to the post page view
          renderPosting(ReqPostID);
      }
  });
}

// these helpers are kinda unnessairy 
function getPost(postID) {
  return modelInstance.data.posts.find(post => post.postID === postID);
}
function getComment(commentID) {
  return modelInstance.data.comments.find(comment => comment.commentID === commentID);
}

  //  link flair content by linkFlairID ??? what does this do text me
  function getLinkFlairContent(linkFlairID) {
      const flair = modelInstance.data.linkFlairs.find(flair => flair.linkFlairID === linkFlairID);
      return flair ? flair.content : '';
  }

  function buildCommentThread(commentID, level = 0) {
    const comment = getComment(commentID);

    const indent = level * 20; // add indent based on commenters
    let html = `
    <div style="margin-left: ${indent}px; border-left: 1px solid #ccc; padding-left: 10px;">
        <strong>${comment.commentedBy}</strong> • <small>${formatTimeAgo(comment.commentedDate)}</small>
        <p>${comment.content}</p>
        <button class="reply-button" data-comment-id="${comment.commentID}">Reply</button>
    </div>
`;

    // Recursively add replies 
    comment.commentIDs.forEach(replyID => {
        html += buildCommentThread(replyID, level + 1);
    });

    return html;
}

function renderCommentsForPost(postID) {
  const post = getPost(postID);

  let commentSectionHTML = '';

  post.commentIDs.forEach(commentID => { //build comments
      commentSectionHTML += buildCommentThread(commentID);
  });

  return commentSectionHTML;
}

function countComments(PostID) {
  let post = getPost(PostID);
  let totalComments = post.commentIDs.length; 

  // Recursive function 
  function countReplies(commentID) {
      let comment = modelInstance.data.comments.find(c => c.commentID === commentID);
      if (comment && comment.commentIDs.length > 0) {
          totalComments += comment.commentIDs.length;
          comment.commentIDs.forEach(replyID => {
              countReplies(replyID);
          });
      }
  }

  post.commentIDs.forEach(commentID => {
      countReplies(commentID);
  });

  return totalComments;
}

function searchForCommentsInPost(postID, searchTerms) {
  if (!Array.isArray(searchTerms)) {
    searchTerms = [searchTerms]; 
  }

  const comments = getPostComments(postID);  // Get all comments for the post
  const results = searchCommentsByKeyword(comments, searchTerms);  // Call the search function
  
  if (results.length > 0) {
    console.log(`Matching comments found in post ID: ${postID}`);
    return postID;
  } 
  
  console.log(`No matching comments found in post ID: ${postID}`);
  return null;
}

function searchCommentsByKeyword(comments, searchTerms) {
  let results = [];

  comments.forEach(comment => {
      // Check if any of the search terms match the comment content
      console.log(comment);
      const matchFound = searchTerms.some(term => comment.content.toLowerCase().includes(term.toLowerCase()));

      if (matchFound) {
          results.push(comment);
      }

      // Recursively search in replies if any
      if (comment.commentIDs.length > 0) {
          const replies = modelInstance.data.comments.filter(c => comment.commentIDs.includes(c.commentID));
          const replyResults = searchCommentsByKeyword(replies, searchTerms);
          results = results.concat(replyResults);
      }
  });

  return results;
}

function getPostComments(postID) {
  // Retrieve the comments for a specific post
  const post = getPost(postID); // Assuming you have a function that retrieves a post by ID
  const comments = modelInstance.data.comments.filter(c => post.commentIDs.includes(c.commentID));
  return comments;
}

function getMostRecentCommentDate(commentIDs) {
  if (!commentIDs || commentIDs.length === 0) return null;

  const comments = commentIDs.map(id => getComment(id)); // Get all comments by IDs
  const sortedComments = comments.sort((c1, c2) => new Date(c2.commentedDate) - new Date(c1.commentedDate)); // Sort by most recent

  return sortedComments.length > 0 ? sortedComments[0].commentedDate : null; // Return the most recent comment date
}



  // call renders
  renderPosts();
  renderCommunities();

};

// does toast thing when you attempt to submit
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.backgroundColor = 'rgba(0,0,0,0.7)';
  toast.style.color = 'white';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '5px';
  toast.style.fontFamily = 'Verdana';

  document.body.appendChild(toast);

  // remove it after 3 seconds
  setTimeout(() => {
      document.body.removeChild(toast);
  }, 3000);
}

//date
function formatTimeAgo(submissionDate, currentDate = new Date()) {
  const seconds = Math.floor((currentDate - submissionDate) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  } else if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (days < 30) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''} ago`;
  } else {
      return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
}




