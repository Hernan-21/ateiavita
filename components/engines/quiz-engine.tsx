"use client";

import { QuizPayload } from "@/types/content";
import { useState } from "react";
import { Check, X, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function QuizEngine({ data, onComplete }: { data: QuizPayload, onComplete?: (score: number) => void }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const questions = data.questions || [];
    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        const isCorrect = selectedOption === currentQuestion.correctAnswer;
        if (isCorrect) setScore(score + 1);
        setIsAnswered(true);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
            if (onComplete) onComplete(Math.round((score / questions.length) * 100));
        }
    };

    const handleRetry = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResults(false);
    }

    if (questions.length === 0) {
        return <div className="p-8 text-center text-gray-500">No questions configured for this quiz.</div>;
    }

    if (showResults) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="bg-white rounded-xl p-8 border border-gray-100 text-center space-y-6">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-3xl font-bold text-indigo-600">
                    {percentage}%
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Quiz Completed!</h3>
                    <p className="text-gray-500">You scored {score} out of {questions.length}</p>
                </div>
                <div className="flex justify-center gap-4">
                    <Button onClick={handleRetry} variant="outline" className="gap-2">
                        <RotateCcw className="w-4 h-4" /> Retry
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                ></div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Question {currentQuestionIndex + 1} of {questions.length}</span>
                    <h3 className="text-xl font-medium text-gray-900 mt-2">{currentQuestion.text}</h3>
                </div>

                <div className="p-6 space-y-3">
                    {currentQuestion.options.map((option, index) => {
                        let optionClass = "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50";
                        if (selectedOption === index) optionClass = "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600";

                        if (isAnswered) {
                            if (index === currentQuestion.correctAnswer) {
                                optionClass = "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500";
                            } else if (selectedOption === index) {
                                optionClass = "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500";
                            } else {
                                optionClass = "opacity-50 border-gray-100";
                            }
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleOptionSelect(index)}
                                disabled={isAnswered}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all flex justify-between items-center ${optionClass}`}
                            >
                                <span>{option}</span>
                                {isAnswered && index === currentQuestion.correctAnswer && <Check className="w-5 h-5 text-green-600" />}
                                {isAnswered && selectedOption === index && index !== currentQuestion.correctAnswer && <X className="w-5 h-5 text-red-600" />}
                            </button>
                        )
                    })}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    {!isAnswered ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={selectedOption === null}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            Check Answer
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className="gap-2"
                        >
                            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"} <ArrowRight className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
