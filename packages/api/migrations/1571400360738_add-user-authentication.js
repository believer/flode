exports.up = pgm => {
  pgm.addColumns('user', {
    salt: {
      default: '',
      notNull: true,
      type: 'text',
    },
    password_hash: {
      default: '',
      notNull: true,
      type: 'text',
    },
  })

  pgm.sql(`ALTER TABLE "user" ALTER COLUMN salt DROP DEFAULT`)
  pgm.sql(`ALTER TABLE "user" ALTER COLUMN password_hash DROP DEFAULT`)

  pgm.sql(
    `UPDATE "user"
    SET password_hash = '2/uQjrcxmVT5WoMvmd6kfAn19tJ64jcgvXTuz0WEK3mOEZtkrP9OJLAc0RY4DeUCQN/UpTbOZrKO2N+p',
    salt = 'Ll4UGtpBV2CFqkFf'
    WHERE id = 1
    `
  )
}

exports.down = pgm => {
  pgm.dropColumns('user', ['salt', 'password_hash'])
}
