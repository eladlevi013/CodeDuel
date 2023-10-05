<template> 
    <div class="action-container">
    test
    </div>
</template>

<script>
export default {
    name: 'QuickMenu',
    data() {
        return {
            roomCode: '',
        };
    }
}
</script>

<style>
.action-container {
  width: 700px;
  margin: auto;
  gap: 1.0rem;
  background-color: #e8e0c5;
  padding: 0.8rem 1.9rem;
  border-radius: 15px;
  margin-top: 35px;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
}

.buttonDesign {
  cursor: pointer;
  border: none;
  border-radius: .5rem;
  font-size: 1rem;
  padding: 0.5rem 4rem;
  transition: transform 0.2s ease-in-out, 
    background-color 0.2s ease-in-out;
  background: linear-gradient(to bottom, 
    #fff, #f8eedb);
  color: #482307;
  box-shadow: -6px 8px 10px rgba(81,41,10,0.1),
    0px 2px 2px rgba(81,41,10,0.2);
}

.buttonDesign:active {
  background-color: #f3f4f6;
  box-shadow: -1px 2px 5px rgba(81,41,10,0.15), 
    0px 1px 1px rgba(81,41,10,0.15);
  transform: translateY(0.125rem);
}

button:hover {
  transform: scale(1.02);
} 
</style>