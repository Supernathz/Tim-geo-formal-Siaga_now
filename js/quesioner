function checkAnswers(){

    let score = 0;
    let total = 10;

    for(let i = 1; i <= total; i++){

        let answers = document.getElementsByName("q" + i);
        let correct = false;

        for(let answer of answers){

            if(answer.checked && answer.value === "correct"){
                correct = true;
                score++;
            }
        }

        // show explanation
        let explanation = answers[0]
            .closest(".question")
            .querySelector(".explanation");

        explanation.style.display = "block";

        // green if correct, red if wrong
        if(correct){
            explanation.style.borderLeftColor = "green";
        } else {
            explanation.style.borderLeftColor = "red";
        }
    }

    document.getElementById("result").innerHTML =
        "Skor Kamu: " + score + " / " + total;
}
