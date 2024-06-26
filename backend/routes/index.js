const express = require("express");
const bodyParser = require("body-parser");
const User = require("./users");
const Discussion = require("./discussions");
const UserAnswer = require("./userAnswers");
const Question = require("./questions");
const Category = require("./category");

const router = express.Router();
router.use(bodyParser.json());
router.use(express.json());

// user
router.post("/signup", (req, res) => {
  console.log(`user collections`);
  try {
    const tmp = User.usersModel.findById(req.body.user_id, (err, users) => {
      console.log(users);
      if (users) {
        return res.status(409).json({ message: "이미 가입된 유저입니다." });
      } else {
        User.create({ user_id: req.body.user_id, password: req.body.password });
        res
          .status(201)
          .json({ user_id: req.body.user_id, message: "회원 가입 성공" });
      }
    });
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

//login sector
router.post("/login", (req, res) => {
  const { user_id, password } = req.body;
  // 요청된 user_id를 데이터베이스에서 찾는다.
  try {
    User.usersModel.findById(user_id, (err, user) => {
      if (err) {
        return res.status(500).json({ success: false, message: "서버 에러 발생" });
      }

      if (!user) {
        return res.status(400).json({ success: false, message: "존재하지 않는 아이디입니다." });
      }
      // 비밀번호 확인 
      if (user.password === password) {
        
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ // 상태 코드를 201로 변경
          success: true,
          user_id: user.id // 사용자의 ID를 반환
        });
      } else {
        return res.status(401).json({ success: false, message: "비밀번호가 틀렸습니다." });
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "서버 처리 중 오류 발생" });
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
      { question_id: req.query.question_id },
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
              if (messages.length > 0) {
                  return res.status(409).json({ message: "이미 푼 문제입니다." });
              } else {
                  let selectedAnswers;
                  // selected_answer가 배열인지 확인하고, 대문자로 변환 처리
                  if (Array.isArray(req.body.selected_answer)) {
                      selectedAnswers = req.body.selected_answer.map(answer => answer.toUpperCase());
                  } else {
                      selectedAnswers = [req.body.selected_answer.toUpperCase()];
                  }

                  UserAnswer.create({
                      user_id: req.body.user_id,
                      question_id: req.body.question_id,
                      selected_answer: selectedAnswers,
                  });
                  res.status(200).send();
              }
          }
      );
  } catch (err) {
      console.error("could not save: " + err);
      res.status(500).json(err);
  }
});


router.get("/answer", (req, res) => {
  console.log(`get answer`);
  try {
    UserAnswer.userAnswersModel.find(
      { user_id: req.query.user_id, question_id: req.body.question_id },
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

router.get("/ratio", async (req, res) => {
  try {
    const messages = await UserAnswer.userAnswersModel.find({ question_id: req.query.question_id }).exec();
    let counts = {}; // 각 선택지에 대한 카운트
    let total = 0; // 전체 답변 수

    messages.forEach((message) => {
      // 다중 선택지 처리
      message.selected_answer.forEach((answer) => {
        // answer는 선택된 답변의 텍스트
        if (!counts[answer]) {
          counts[answer] = 0;
        }
        counts[answer]++;
        total++;
      });
    });

    let result = {};
    Object.keys(counts).forEach((key) => {
      result[key] = ((counts[key] / total) * 100).toFixed(2);
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});



// question
router.post("/question", async (req, res) => {
  try {
    let temp = req.body;

    // // 질문 텍스트 중복 체크
    // const dupCheck = await Question.qstModel.findOne({
    //   question_text: temp.question_text,
    // });
    // if (dupCheck) {
    //   return res.status(409).json({ message: "Duplicate question text" });
    // }

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
      data: questions.map((q) => q.toObject({ getters: false })),
    };

    res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/question-detail", async (req, res) => {
  const { _id } = req.query;
  console.log(`get each question by _id`);
  try {
    const qid = await Question.qstModel.findOne({ _id: _id });

    if (!qid || qid.length === 0) {
      return res.status(404).json({ message: "No question" });
    }

    const question = qid.toObject({ getters: false });
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json(err);
  }
});

// category
router.post("/category", async (req, res) => {
  console.log(`add category`);
  try {
    const dupCheck = await Category.cateModel.findOne({
      qualification_type: req.body.qualification_type,
    });
    if (dupCheck) {
      return res.status(409).json({ message: "Duplicate category" });
    }

    await Category.cateModel.create({
      qualification_type: req.body.qualification_type,
    });
    res.status(200).json({ message: "Category add success" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/category", async (req, res) => {
  console.log(`get category`);
  try {
    const tempCate = await Category.cateModel.find({}).exec();
    const categories = tempCate.map((category) => category.qualification_type);
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
