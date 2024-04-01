const express = require("express");
const bodyParser = require("body-parser");
const User = require("./users");
const Discussion = require("./discussions");
const UserAnswer = require("./userAnswers");
const Question = require("./questions");

const router = express.Router();
router.use(bodyParser.json());

// user
router.post("/signup", (req, res) => {
  console.log(`user collections`);
  try {
    User.create({ user_id: req.body.user_id, password: req.body.password });
    res.status(201).send();
  } catch (err) {
    if (err.name == "ValidationError") {
      console.error("validation error: " + err);
      res.status(400).json(err);
    } else {
      console.error("could not save: " + err);
      res.status(500).json(err);
    }
  }
});

// discussion
router.post("/discussion", (req, res) => {
  console.log(`create opinion`);
  try {
    //Question 모델 생성되면
    Discussion.create({
      user_id: req.body.user_id,
      question_id: req.body.question_id,
      discussion_content: req.body.discussion_content,
    });
    res.status(200).send();
  } catch (err) {
    if (err.name == "ValidationError") {
      console.error("validation error: " + err);
      res.status(400).json(err);
    } else {
      console.error("could not save: " + err);
      res.status(500).json(err);
    }
  }
});

router.get("/discussion", (req, res) => {
  console.log(`get discussion`);
  try {
    Discussion.discussionsModel.find(
      { question_id: req.body.question_id },
      (err, messages) => {
        let list = [];
        console.log(messages);
        if (messages.length > 0) {
          messages.forEach((message) => {
            if (message.user_id && message.discussion_content) {
              list.push({
                user_id: message.user_id,
                discussion_content: message.discussion_content,
              });
            }
          });
        }
        res.status(200).json(list);
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

// userAnswers
router.post("/answer", (req, res) => {
  console.log(`create answer`);
  try {
    UserAnswer.userAnswersModel.find(
      { user_id: req.body.user_id, question_id: req.body.question_id },
      (err, messages) => {
        if (messages.length > 0)
          return res.status(409).json({ message: "이미 푼 문제입니다." });
        else {
          UserAnswer.create({
            user_id: req.body.user_id,
            question_id: req.body.question_id,
            selected_answer: req.body.selected_answer.toUpperCase(),
          });
          res.status(200).send();
        }
      }
    );
  } catch (err) {
    if (err.name == "ValidationError") {
      console.error("validation error: " + err);
      res.status(400).json(err);
    } else {
      console.error("could not save: " + err);
      res.status(500).json(err);
    }
  }
});

router.get("/answer", (req, res) => {
  console.log(`get answer`);
  try {
    UserAnswer.userAnswersModel.find(
      { user_id: req.body.user_id, question_id: req.body.question_id },
      (err, messages) => {
        console.log(messages);
        if (messages.length > 0) {
          messages.forEach((message) => {
            if (message.selected_answer) {
              return res
                .status(200)
                .json({ selected_answer: message.selected_answer });
            }
          });
        }
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/answers", (req, res) => {
  console.log(`get answer`);
  try {
    UserAnswer.userAnswersModel.find(
      { user_id: req.body.user_id },
      (err, messages) => {
        let list = [];
        console.log(messages);
        if (messages.length > 0) {
          messages.forEach((message) => {
            if (message.selected_answer) {
              list.push({
                question_id: message.question_id,
                selected_answer: message.selected_answer,
              });
            }
          });
        }
        res.status(200).json(list);
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/ratio", (req, res) => {
  console.log(`get ratio`);
  try {
    UserAnswer.userAnswersModel.find(
      { question_id: req.body.question_id },
      (err, messages) => {
        let ratio = {};
        let total = 0;
        let result = {};
        console.log(messages);
        if (messages.length > 0) {
          messages.forEach((message) => {
            let s_answers = message.selected_answer.split("");
            console.log(s_answers);
            s_answers.forEach((s_answer) => {
              console.log(s_answer);
              total++;
              if (s_answer in ratio) ratio[s_answer] += 1;
              else ratio[s_answer] = 1;
            });
          });
        }
        console.log(ratio);
        for (r in ratio) {
          result[r] = ((ratio[r] / total) * 100).toFixed(2);
        }
        res.status(200).json(result);
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

// question
router.post("/question", async (req, res) => {
  try {
    let temp = req.body;

    // 질문 텍스트 중복 체크
    const dupCheck = await Question.qstModel.findOne({
      question_text: temp.question_text,
    });
    if (dupCheck) {
      return res.status(409).json({ message: "Duplicate question text" });
    }

    // qst_counter에서 name 조회 후 count 판단
    const type = req.body.qualification_type;
    let response = await Question.qstCounter.findOne({ type: type });
    if (response) {
      temp._id = `${type}_${++response.count}`;
      await createQuestion(temp);
      await response.save();
    } else {
      // 없으면 초기등록
      temp._id = `${type}_1`;
      await createQuestion(temp);
      await Question.qstCounter.create({ type: type, count: 1 });
    }
    res.status(201).json({ message: "Question add success" });
  } catch (err) {
    if (err.name == "ValidationError") {
      console.error("validation error: " + err);
      res.status(400).json(err);
    } else {
      console.error("could not save: " + err);
      res.status(500).json(err);
    }
  }
});

async function createQuestion(temp) {
  await Question.qstModel.create({
    _id: temp._id,
    user_id: temp.user_id,
    qualification_type: temp.qualification_type,
    question_text: temp.question_text,
    options: temp.options,
    correct_answer: temp.correct_answer,
  });
}

router.get("/question", async (req, res) => {
  const { qualification_type } = req.query;
  console.log(`get question by qualification_type`);
  try {
    const questions = await Question.qstModel.find({
      qualification_type: qualification_type,
    });

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: "No questions" });
    }

    const list = {
      data: questions.map((q) => q.toObject({ getters: true })),
    };

    res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
