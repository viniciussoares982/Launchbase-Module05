const Intl = require('intl')
const { age, date } = require('../../lib/utils')
const Member = require('../model/member')

module.exports = {
    index(req, res) {

        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2

        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(members) {

                const pagination = {
                    total: Math.ceil(members[0].total / limit),
                    page
                    
                }

                if(members == 'Não encontrado') {
                    return res.render('members/notfound', { filter })
                }

                return res.render('members/index', { members, pagination, filter })

            }
        }

        Member.paginate(params)
        
    },
    create(req, res) {

        Member.instructorsSelectOptions( function(options) {
            return res.render('members/create', { InstructorOptions: options })
        })

    },
    post(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys) {
            if(req.body[key] == '') {
                res.send(`Por favor preencha todos os campos para continuar`)
            }
        }

        Member.create(req.body, function(member) {
            return res.redirect(`/members/${member.id}`)
        })

     },
    show(req, res) {
        
        Member.find(req.params.id, function(member) {
            if(!member) {
                return res.send('member not found')
            }

            member.birth = date(member.birth).birthDay

            return res.render('members/show', { member })

        })
     },
    edit(req, res) {
        Member.find(req.params.id, function(member) {
            if(!member) {
                return res.send('member not found')
            }

            member.birth = date(member.birth).iso

            Member.instructorsSelectOptions( function(options) {
                return res.render('members/edit', { member, InstructorOptions: options })
            })

        })

     },
    put(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys) {
            if(req.body[key] == '') {
                res.send(`Por favor preencha todos os campos para continuar`)
            }
        }

        Member.update(req.body, function() {
            return res.redirect(`/members/${req.body.id}`)
        })
     },
    delete(req, res) {
        Member.delete(req.body.id, function() {
            return res.redirect(`/members`)
        })

     },
}