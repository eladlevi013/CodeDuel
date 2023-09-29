<template>
<div className='navbar-container'>
  <div>
    <a class="navbar-title" href="/">Home</a>
    <a class="navbar-title">Github</a>
    <a class="navbar-title">About</a>
  </div>
</div>
</template>

<style>
.navbar-container {
  background-color: #39261f;
  width: 100%;
  height: 55px;
  top: 10;
  left: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-title {
  font-family: 'Poppins', cursive;
  font-size: 17px;
  margin-left: 15px;
  color: white;
  text-decoration: none;
  padding-top: 100px;
  margin-top: 100px;
  cursor: pointer;
}
</style>