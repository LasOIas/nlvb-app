import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Input } from "@/components/ui/Input.jsx";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
  DialogHeader
} from "@/components/ui/Dialog.jsx";

const PlayerGroupingApp = () => {
  const [players, setPlayers] = useState(() => {
    try {
      const storedPlayers = JSON.parse(localStorage.getItem("players"));
      return Array.isArray(storedPlayers) ? storedPlayers : [];
    } catch {
      return [];
    }
  });

  const [checkedInPlayers, setCheckedInPlayers] = useState(() => {
    try {
      const storedCheckedIn = JSON.parse(localStorage.getItem("checkedInPlayers"));
      return Array.isArray(storedCheckedIn) ? storedCheckedIn : [];
    } catch {
      return [];
    }
  });

  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const [groups, setGroups] = useState(() => {
    const savedGroups = localStorage.getItem("groups");
    const parsed = parseInt(savedGroups);
    return !isNaN(parsed) && parsed > 0 ? parsed : 2;
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem("isAdmin") === "true");
  const [adminCode, setAdminCode] = useState("");
  const [checkInMessage, setCheckInMessage] = useState("");
  const [newPlayerName, setNewPlayerName] = useState("");
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [playerToRemove, setPlayerToRemove] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem("checkedInPlayers", JSON.stringify(checkedInPlayers));
  }, [checkedInPlayers]);

  useEffect(() => {
    localStorage.setItem("groups", groups.toString());
  }, [groups]);

  const normalize = (str) => str.trim().toLowerCase();

  const checkInPlayer = () => {
    const inputName = name.trim();
    if (!inputName) return;
    const lowerInput = normalize(inputName);
    const matchedPlayer = players.find(player => normalize(player.name) === lowerInput);

    if (matchedPlayer) {
      if (!checkedInPlayers.some(checked => normalize(checked) === lowerInput)) {
        setCheckedInPlayers(prev => [...prev, matchedPlayer.name]);
      }
      setCheckInMessage("You are checked in");
    } else {
      setCheckInMessage("Player not found in history");
    }

    setTimeout(() => setCheckInMessage(""), 3000);
    setName("");
  };

  const registerNewPlayer = () => {
    const trimmedName = newPlayerName.trim();
    if (!trimmedName) return;

    const exists = players.some(player => normalize(player.name) === normalize(trimmedName));
    if (exists) {
      setRegistrationMessage("Player already registered.");
    } else {
      setPlayers(prev => [...prev, { name: trimmedName, skill: 0 }]);
      setRegistrationMessage("Player registered. Waiting for admin to assign skill.");
    }

    setTimeout(() => setRegistrationMessage(""), 3000);
    setNewPlayerName("");
  };

  const loginAsAdmin = () => {
    if (adminCode === "nlvb2025") {
      setIsAdmin(true);
      sessionStorage.setItem("isAdmin", "true");
    } else {
      alert("Incorrect admin code");
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem("isAdmin");
    setShowLogoutConfirm(false);
  };

  const resetCheckIns = () => {
    setCheckedInPlayers([]);
    setShowResetConfirm(false);
  };

  const confirmRemovePlayer = (index) => {
    setPlayerToRemove(index);
  };

  const removeConfirmedPlayer = () => {
    if (playerToRemove !== null && playerToRemove >= 0 && playerToRemove < players.length) {
      setPlayers(players.filter((_, i) => i !== playerToRemove));
      setPlayerToRemove(null);
    }
  };

  const editPlayer = (index) => {
    if (index >= 0 && index < players.length) {
      setName(players[index].name);
      setSkill(players[index].skill.toString());
      setEditingIndex(index);
    }
  };

  const addOrUpdatePlayer = () => {
    const trimmedName = name.trim();
    const parsedSkill = parseFloat(skill);
    if (!trimmedName || isNaN(parsedSkill) || parsedSkill <= 0) return;

    const updatedPlayers = [...players];
    if (editingIndex !== null && editingIndex >= 0 && editingIndex < players.length) {
      updatedPlayers[editingIndex] = { name: trimmedName, skill: parsedSkill };
      setEditingIndex(null);
    } else {
      const exists = players.some(p => normalize(p.name) === normalize(trimmedName));
      if (!exists) {
        updatedPlayers.push({ name: trimmedName, skill: parsedSkill });
      }
    }

    setPlayers(updatedPlayers);
    setName("");
    setSkill("");
  };

  const distributePlayers = () => {
    if (!Array.isArray(players) || players.length === 0) return [];
    const eligiblePlayers = players.filter(player =>
      checkedInPlayers.some(name => normalize(name) === normalize(player.name))
    );

    const sortedPlayers = [...eligiblePlayers].sort((a, b) => b.skill - a.skill);
    const teamArray = Array.from({ length: groups }, () => []);
    const teamSkills = new Array(groups).fill(0);

    for (const player of sortedPlayers) {
      let minIndex = 0;
      for (let i = 1; i < groups; i++) {
        if (teamSkills[i] < teamSkills[minIndex]) {
          minIndex = i;
        }
      }
      teamArray[minIndex].push(player);
      teamSkills[minIndex] += player.skill;
    }

    return teamArray;
  };

  return (
    <div className="p-4 min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">NLVB Player Grouping App</h1>
      {!isAdmin ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">Check-In</h2>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="text-black" />
          <Button onClick={checkInPlayer} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">Check In</Button>
          {checkInMessage && <p className="mt-2 text-green-400">{checkInMessage}</p>}

          <div className="mt-6">
            <h2 className="text-xl font-bold">New Player Registration</h2>
            <Input value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} placeholder="Your name" className="mt-2 text-black" />
            <Button onClick={registerNewPlayer} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">Register</Button>
            {registrationMessage && <p className="mt-2 text-blue-400">{registrationMessage}</p>}
          </div>

          <div className="mt-6">
            <h2 className="font-bold">Admin Login</h2>
            <Input type="password" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} placeholder="Enter admin code" className="text-black" />
            <Button onClick={loginAsAdmin} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">Login</Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex gap-2 mb-4">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Player Name" className="text-black" />
            <Input value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="Skill Level" className="text-black" />
            <Button onClick={addOrUpdatePlayer} className="bg-blue-600 hover:bg-blue-700 text-white">
              {editingIndex !== null ? "Update Player" : "Add Player"}
            </Button>
          </div>

          <div className="my-4">
            <label>Number of Groups:</label>
            <select value={groups} onChange={(e) => setGroups(Number(e.target.value))} className="border rounded p-2 ml-2 text-black">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <Button onClick={() => setShowResetConfirm(true)} className="ml-4 bg-red-600 hover:bg-red-700 text-white">Reset Check-Ins</Button>
            <Button onClick={() => setShowLogoutConfirm(true)} className="ml-4 bg-red-600 hover:bg-red-700 text-white">Logout</Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {players.map((player, index) => (
              <Card key={index} className={`p-2 flex justify-between ${player.skill === 0 ? "bg-yellow-100 border border-yellow-400 text-black" : ""}`}>
                <CardContent>
                  {player.name} (Skill: {player.skill}) {checkedInPlayers.includes(player.name) && "✔"}
                </CardContent>
                <div className="flex gap-2">
                  <Button onClick={() => editPlayer(index)} className="bg-blue-600 hover:bg-blue-700 text-white">Edit</Button>
                  <Button onClick={() => confirmRemovePlayer(index)} className="bg-red-600 hover:bg-red-700 text-white">Remove</Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Logout Dialog */}
          <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogDescription>This will log you out of admin mode.</DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={() => setShowLogoutConfirm(false)} className="text-white">Cancel</Button>
                <Button onClick={logoutAdmin} className="bg-red-600 hover:bg-red-700 text-white">Logout</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Reset Dialog */}
          <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset Check-Ins</DialogTitle>
                <DialogDescription>This will clear all checked-in players.</DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={() => setShowResetConfirm(false)} className="text-white">Cancel</Button>
                <Button onClick={resetCheckIns} className="bg-red-600 hover:bg-red-700 text-white">Reset</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Remove Dialog */}
          <Dialog open={playerToRemove !== null} onOpenChange={() => setPlayerToRemove(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove Player</DialogTitle>
                <DialogDescription>This will permanently delete this player.</DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={() => setPlayerToRemove(null)} className="text-white">Cancel</Button>
                <Button onClick={removeConfirmedPlayer} className="bg-red-600 hover:bg-red-700 text-white">Remove</Button>
              </div>
            </DialogContent>
          </Dialog>

          <h2 className="text-xl font-bold mt-4">Groups</h2>
          <div className="grid grid-cols-2 gap-4">
            {distributePlayers().map((group, idx) => {
              const totalSkill = group.reduce((sum, player) => sum + player.skill, 0);
              return (
                <Card key={idx} className="p-2">
                  <CardContent>
                    <h3 className="font-bold">
                      Group {idx + 1} ({group.length} players, Total Skill: {totalSkill})
                    </h3>
                    {group.map((player, index) => (
                      <p key={index}>{player.name} (Skill: {player.skill})</p>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerGroupingApp;
