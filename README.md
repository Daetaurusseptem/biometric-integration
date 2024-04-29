<h1>
  Zk Biometric syncronizer with MEAN Stack
</h1>


  
<h2>How it works?</h2> 
<h3>
  it is a simple implementation of 3 basic nodes
</h3> 
<ul>
  <li>
    <h6>
    Biometric
    </h6>
    <p>
      Reads all the attendances through  the day a stored them
    </p>
  </li>
  <li>
    <h5>
    Script
    </h5>
    <p>
      there's 2 scripts:
      <ul>
        <li>
          <h6>
            Attendances syncronizer
          </h6>
          Reads all the attendances that happened in a fraction of time eg. 24hrs  (you can set it), send the data to an api endpoint to process it, and store it in a data base
        </li>
      <ul>
        <h6>
          New Employee Syncronizer
        </h6>
        <li>
          Syncs all the new users, this script has to run every time theres a new user and it is manual (just run the script), and sync the new employee to the database through the API
        </li>
      <ul>

      </ul>
    </p>
  </li>
  <li>
    <h6>
    Web App
    </h6>
    <p>
      
    </p>
  </li>
</ul>

![img](https://github.com/Daetaurusseptem/biometric-integration/assets/78524937/4e92bbd3-aa44-4d22-8384-bbf0dd9bcc94)
