import trueskill

import sys, json
from itertools import izip

#team rankings are always the first two args
rankings = [sys.argv[1], sys.argv[2]] 

#the rest of the argvs are mu and sigma for each player
#first team is the first half of the remaining arguments
team1 = []
for i in xrange(3, 3 + (len(sys.argv) - 3) // 2, 2):
    team1.append(trueskill.Rating(mu=float(sys.argv[i]), sigma=float(sys.argv[i + 1])))

#the rest of argv is team 2
team2 = []
for i in xrange(3 + (len(sys.argv) - 3) // 2, len(sys.argv), 2):
    team2.append(trueskill.Rating(mu=float(sys.argv[i]), sigma=float(sys.argv[i + 1])))

#calculate new rankings. Documentation says teams have to be tuples or dictionaries
rated_rating_groups = trueskill.rate([tuple(team1), tuple(team2)], ranks=rankings)
(r1,), (r2,) = rated_rating_groups

#setup a json, consisting of a list of dictionaries, with the results
new_ratings_json = []

for mu, sigma in izip(r1, r2):
    new_ratings_json.append({
        'mu': mu,
        'sigma': sigma
    }) 

#print results so the node.js code can grab it
print json.dumps(new_ratings_json)
print rankings
print team1
print team2
print r1
print r2

