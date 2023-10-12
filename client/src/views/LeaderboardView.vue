<template>
    <h1 class="title">Leaderboard📊</h1>
    <div class="table-container" v-if="leaderboard.length > 0">
        <table class="table">
            <thead> 
                <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, index) in leaderboard" :key="user.username">
                    <td>
                <!-- Using a span to adjust the size of the crown -->
                <span v-if="index === 0" class="crown">👑</span> 
                <span v-else>{{ index + 1 }}</span>
            </td>                    <td>{{ user.username }}</td>
                    <td>{{ user.score }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <h3 v-else class="no-players-text">No users have played yet...</h3>
</template>

<script>
import axios from 'axios';

export default {
    mounted() {
        axios.get(`${process.env.VUE_APP_SERVER_URL}/users/leaderboard`)
        .then((res) => {
            this.leaderboard = res.data.leaderboard;
        })
        .catch((err) => {
            console.log(err);
        });
    },
    data() {
        return {
            leaderboard: [],
        };
    },
}
</script>

<style scoped>
body {
    font-family: 'Poppins', cursive;

}

.table-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%; 
}

.title {
    font-size: 50px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.table {
    border-collapse: separate;
    border-spacing: 0;
    width: 60%; 
    max-width: 100%;
    margin: 0 auto;
    margin-bottom: 50px;
    box-shadow: 0px 0px 20px rgba(0,0,0,0.18);
    border-radius: 10px;
    overflow: hidden;  /* For the rounded corners */
}

.table th, .table td {
    padding: 15px 20px;
    border: none; 
    text-align: center;
    font-size: 20px;
}

.table tbody tr:nth-child(odd) {
    background-color: #ede6cf;
}

.table tbody tr:nth-child(even) {
    background-color: #f2ebd6; /* Slightly darker shade */
}

.table tr:hover {
    background-color: rgba(57,38,31,0.1);
}

.table th {
    background-color: #4A3423;
    color: #FFFFFF;
    font-weight: 600;
    font-family: Arial, sans-serif; 
}

.no-players-text {
    margin-bottom: 50px;
    color: #aaa;
    text-align: center;
    font-size: 20px;
}

.crown {
    font-size: 35px;
    vertical-align: middle;
    display: inline-block;
    line-height: 1; /* Reset the line-height for the crown span to ensure it doesn't add extra height. */
}

</style>
