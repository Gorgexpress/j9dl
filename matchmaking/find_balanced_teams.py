import sys, json
import trueskill
from itertools import combinations
players = []

for i in xrange(1, len(sys.argv), 2):
    players.append(trueskill.Rating(mu=float(sys.argv[i]), sigma=float(sys.argv[i + 1])))

if len(players) <= 2:
    result = [0, 1]
    print result

indices = range(len(players))
halfLength = len(players) / 2
bestQuality = trueskill.quality([players[:halfLength], players[halfLength:]])
bestTeams = indices

for combination in combinations(indices[1:], halfLength):
    team1Indices =  list(combination)
    team2Indices = list(set(indices) - set(team1Indices))
    team1 = [players[i] for i in team1Indices]
    team2 = [players[i] for i in team2Indices]
    quality = trueskill.quality([team1, team2])
    if quality > bestQuality:
        bestQuality = quality
        bestTeams = team1Indices + team2Indices

print bestTeams
